import { getRestaurantsWithMeal } from "../dishes-service/dishes-service"
import { OrderPayload } from "../layout/layout"

export default function RestaurantForm({ payload, handleChange }: { payload: OrderPayload, handleChange: any }) {
    const restaurants = getRestaurantsWithMeal(payload.mealType)
    const displayRestaurnts: any[] = []

    restaurants.forEach((rest, idx) => {
        displayRestaurnts.push(<option key={idx}>{ rest }</option>)
    })

    return (
        <div>
            <h1>Choose a Restaurant</h1>
            <div className="flex flex-col">
                <div className="flex flex-col px-4 py-4">
                    <label>Restaurants</label>
                    <select
                        placeholder="select a restaurant"
                        name="restaurant"
                        value={payload.restaurant}
                        onChange={handleChange}
                        data-testid="select-a-restaurant">
                        <option label=" "></option>
                        { displayRestaurnts }
                    </select>
                </div>
            </div>
        </div>
    )
}