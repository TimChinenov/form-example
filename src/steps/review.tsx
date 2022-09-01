import { OrderPayload } from "../layout/layout";

export default function Review({payload}: {payload: OrderPayload}) {
    let dishes: any[] = []
    Array.from(payload.dishes.values()).forEach((dish, idx) => {
        dishes.push(<p key={idx} className="flex flex-row">{dish.menuItem.name} - {dish.quantity}</p>)
    })

    return (
        <div>
            <h1>Review Your Order</h1>
            <div className="grid grid-cols-2 gap-10 pb-8" >
                <div className="justify-self-end">Meal:</div>
                <div>{payload.mealType}</div>
                <div className="justify-self-end">No. of People:</div>
                <div>{payload.numberOfPeople}</div>
                <div className="justify-self-end">Restaurant:</div>
                <div>{payload.restaurant}</div>
                <div className="pt-6 justify-self-end">Dishes:</div>
                <div className="pt-6">
                { dishes }
                </div>
            </div>
        </div>
    )
}