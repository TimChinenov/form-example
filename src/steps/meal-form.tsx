import { getMeals } from "../dishes-service/dishes-service";
import { OrderPayload } from "../layout/layout";

export default function MealForm({ payload, handleChange }: { payload: OrderPayload, handleChange: any }) {

    const meals = getMeals();
    const displayMeals: any[] = []
    meals.forEach((meal, idx) => {
        displayMeals.push(<option key={idx}>{ meal }</option>)
    })

    return (
        <div>
            <h1>Choose A Meal</h1>
            <div className="flex flex-col">
                <div className="flex flex-col px-4 py-4">
                    <label>Select A Meal</label>
                    <select
                        name="mealType"
                        value={payload.mealType}
                        onChange={handleChange}
                        data-testid="select-meal">
                            <option label=" "></option>
                            { displayMeals }
                    </select>
                </div>
                <div className="flex flex-col px-4 py-4">
                    <label>Enter Number of People</label>
                    <input
                        placeholder="i.e. 42"
                        type="number"
                        name="numberOfPeople"
                        value={payload.numberOfPeople}
                        onChange={handleChange}
                        data-testid="input-number-of-people">
                    </input>
                </div>
            </div>
        </div>
    )
}