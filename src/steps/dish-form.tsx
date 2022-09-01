import { useEffect, useState } from "react";
import { getDishesForMealAndRestaurant } from "../dishes-service/dishes-service"
import { Dish, MenuItem, OrderPayload } from "../layout/layout";

export default function DishForm({ payload, updateDishes }: {payload: OrderPayload, updateDishes: any}) {
    const [displaySelectedDishes, updateDisplayDishes] = useState<any[]>([]);
    let availableDishes: MenuItem[] = []
    let selectedDishes = new Set<number>()
    let dishForm: any[] = []
    let displayDishes: any[] = []

    Array.from(payload.dishes.values()).forEach((dish) => {
        selectedDishes.add(dish.menuItem.id)
    })

    // update available dishes
    availableDishes = getDishesForMealAndRestaurant(payload.mealType, payload.restaurant);
    availableDishes = availableDishes.filter(dish => !selectedDishes.has(dish.id))
    availableDishes.forEach((dish, idx) => displayDishes.push(<option key={idx} value={dish.id}>{ dish.name }</option>))

    Array.from(payload.dishes.values()).forEach((dish, idx) => {
        dishForm.push(
            <ExistingDish
                key={idx}
                dish={dish}
                updateDishes={updateDishes}
            />
        )
    })

    if (dishForm.length === 0) {
        dishForm.push(
            <NewDish 
                key={displaySelectedDishes.length}
                displayDishes={displayDishes}
                availableDishes={availableDishes}
                updateDishes={updateDishes}
            />)
    }

    useEffect(() => {
        updateDisplayDishes(dishForm)
    }, [payload])

    const addDish = () => {
        updateDisplayDishes((prev) => {
            return [...prev,
                <NewDish 
                    key={displaySelectedDishes.length}
                    displayDishes={displayDishes}
                    availableDishes={availableDishes}
                    updateDishes={updateDishes}
                />
            ]
        })
    }

    return (
        <div>
            <h1>Choose Your Dishes</h1>
            <div className="flex flex-col pb-8">
                <div className="pt-8">
                    { displaySelectedDishes }
                </div>

                {
                    availableDishes.length > 0 &&
                    <div className="flex flex-row py-6 place-content-center">
                        <button className="bg-green-500 rounded-full" onClick={addDish}><h4><strong>+</strong></h4></button>
                    </div>
                }
            </div>
        </div>
    )
}

const NewDish = (
    {
        displayDishes,
        availableDishes,
        updateDishes}: {displayDishes: any, availableDishes: MenuItem[], updateDishes: any}) => {
    const [selectedDishId, selectDishId] = useState();

    const createNewDish = (event: any) => {
        if (!event.target.value) {
            return
        }

        let newDish: Dish = {
            menuItem: availableDishes.filter((dish) => event.target.value == dish.id)[0],
            quantity: 1
        }

        selectDishId(event.target.value)

        updateDishes(newDish)
    }

    return(
        <div className="flex flex-row">
            <div className="flex flex-col">
                <label>Please Select a Dish</label>
                
                <select value={selectedDishId} onChange={createNewDish} data-testid="selectdish">
                    <option label=" "></option>
                    { displayDishes }
                </select>
            </div>
        </div>
    )
}

const ExistingDish = ({dish, updateDishes}: {dish: Dish, updateDishes: any}) => {
    const [quantity, setQuantity] = useState(dish.quantity)

    const updateQuantity = (event: any) => {
        if (!event.target.value) {
            dish.quantity = 0
            updateDishes(dish)
            return
        }

        dish.quantity = parseInt(event.target.value)
        updateDishes(dish)
    }

    return (
        <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col">
                <label>Item:</label>
                <label>{dish.menuItem.name}</label>
            </div>
            
            <div className="flex flex-col">
                <label>No. of servings</label>
                <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value))}
                    onBlur={updateQuantity}
                    data-testid="select-quantity">
                </input>
            </div>

            <div className="flex flex-col">
                <button
                    className="bg-white text-red-500 rounded-full hover:bg-red-200 drop-shadow-none" 
                    onClick={updateQuantity}>
                    x
                </button>
            </div>
        </div>
    )
}