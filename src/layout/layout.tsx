import { useState } from "react"
import { getMeals } from "../dishes-service/dishes-service";
import DishForm from "../steps/dish-form";
import MealForm from "../steps/meal-form";
import RestaurantForm from "../steps/restaurant-form";
import Review from "../steps/review";

export interface MenuItem {
    id: number,
    name: string,
    restaurant: string,
    availableMeals: string[]
}

export interface Dish {
    menuItem:  MenuItem,
    quantity: number
}

export interface OrderPayload {
    mealType: string,
    numberOfPeople: string,
    restaurant: string,
    dishes: Map<number, Dish>
}

export default function Layout() {
    // State hooks
    const [step, setStep] = useState(0);
    const [ payload, setPayload] = useState<OrderPayload>({
        mealType: "",
        numberOfPeople: "",
        restaurant: "",
        dishes: new Map([])
    });
    const [isValid, setValidity] = useState(true);
    const [errors, setErrors] = useState<any[]>([])
    let errorMessages: any[] = []

    // state change handlers
    const handleOnNext = () => {
        if (step === 3) {
            console.log("submitted form!")
            console.log(payload)
            return
        }

        if (!isCurrentPageValid()) {
            setErrors((prev) => [...errorMessages])
            setValidity(false)
            return
        }
        setErrors([])
        setValidity(true)

        errorMessages = []
        setStep(step + 1);
    }

    const handleOnBack = () => {
        if (step === 0) {
            return;
        }

        errorMessages = []
        setStep(step - 1);
    }

    const handleChange = (event: any) => {
        setPayload((prev: any) => {
            let updatedOrder: OrderPayload = {...prev, [event.target.name]: event.target.value }

            // need to clear future fields, if a existing field is updated
            if (event.target.name === "mealType")
            {
                updatedOrder.restaurant = ""
                updatedOrder.dishes = new Map()
            }
            if (event.target.name === "restaurant")
            {
                updatedOrder.dishes = new Map()
            }

            return updatedOrder
        })
    }

    const updateDishes = (dish: Dish) => {
        setPayload((prev) => {
            if (dish.quantity === 0 || !dish.quantity) {
                if (!payload.dishes.has(dish.menuItem.id)) {
                    return { ...prev }
                }

                let tempMap = new Map(payload.dishes)
                tempMap.delete(dish.menuItem.id)
                return {
                    mealType: prev.mealType,
                    numberOfPeople: prev.numberOfPeople,
                    restaurant: prev.restaurant,
                    dishes: tempMap.size === 0 ? new Map() : tempMap
                }
            }

            return {
                ...prev,
                dishes: new Map(payload.dishes.set(dish.menuItem.id, dish))
            }
        })
    }

    // validators
    const isCurrentPageValid = () => {
        if (step === 0) {
            return isMealFormValid()
        }
        if (step === 1) {
            return isRestaurantFormValid()
        }
        if (step === 2) {
            return isDishesFormValid()
        }

    }

    const isMealFormValid = () => {
        errorMessages = []
        if (!getMeals().includes(payload.mealType) || !payload.mealType) {
            errorMessages.push(<p>No meal provided</p>)
        }

        if (!payload.numberOfPeople || parseInt(payload.numberOfPeople) < 1) {
            errorMessages.push(<p>Must order for at least 1 person</p>)
        } else if (!payload.numberOfPeople || parseInt(payload.numberOfPeople) > 10) {
            errorMessages.push(<p>Cannot order for more than 10 people</p>)
        }

        if (errorMessages.length > 0) {
            return false
        }

        return true
    }
    
    const isRestaurantFormValid = () => {
        errorMessages = []
        if (!payload.restaurant) {
            errorMessages.push(<p>No restaurant selected</p>)
            return false
        }
        return true
    }

    const isDishesFormValid = () => {
        errorMessages = []
        let sumDishes = 0
        let dishes = Array.from(payload.dishes.values())

        for (let dish of dishes) {
            if (dish.quantity == 0) {
                errorMessages.push(<p>Dish {dish.menuItem.name} must have a quantity of at least 1</p>)
            }
            sumDishes += dish.quantity
        }

        if (sumDishes < parseInt(payload.numberOfPeople)) {
            errorMessages.push(<p>Number of dishes must be equal to or greater than number of people</p>)
        }

        if (errorMessages.length > 0) {
            return false;
        }

        return true
    }

    // Render
    return(
        <div className="px-52">
            <section className="flex flex-row">
                <p className={"p-2 px-6 " + (step === 0 ? "bg-slate-700 text-white" : "bg-white text-black")}>Step 1</p>
                <p className={"p-2 px-6 " + (step === 1 ? "bg-slate-700 text-white" : "bg-white text-black")}>Step 2</p>
                <p className={"p-2 px-6 " + (step === 2 ? "bg-slate-700 text-white" : "bg-white text-black")}>Step 3</p>
                <p className={"p-2 px-6 " + (step === 3 ? "bg-slate-700 text-white" : "bg-white text-black")}>Review</p>
            </section>
            <section className="flex flex-col">
                { !isValid && errors.length > 0 &&
                    <div>
                        <p className="text-red-400"><strong>Correct Errors:</strong></p>
                        <div className="text-red-400">
                            { errors }
                        </div>
                    </div>
                }
            </section>
            <section className="w-full mt-5">
                {step === 0 && <MealForm payload={payload} handleChange={handleChange}/>}
                {step === 1 && <RestaurantForm payload={payload} handleChange={handleChange}/>}
                {step === 2 && <DishForm payload={payload} updateDishes={updateDishes}/>}
                {step === 3 && <Review payload={payload}/>}
            </section>
            <section className="flex flex-row place-content-between">
                <div className="px-4 py-2">
                    <button onClick={handleOnBack}>back</button>
                </div>
                <div className="px-4 py-2">
                    <button 
                        onClick={handleOnNext}>{step != 3 ? "next" : "submit"}</button>
                </div>
            </section>
        </div>
    )
}