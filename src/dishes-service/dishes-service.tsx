import dishes from '../dishes.json';

export function getMeals(): string[]
{
    return [
        'breakfast',
        'lunch',
        'dinner'
    ]
}

export function getRestaurantsWithMeal(meal: string): string[]
{
    let restaurantSet = new Set<string>();
    let restaurants = dishes.dishes.filter((dish) => dish.availableMeals.includes(meal))

    restaurants.forEach((dish) => {
        restaurantSet.add(dish.restaurant)
    })

    return Array.from(restaurantSet)
}

export function getDishesForMealAndRestaurant(meal: string, restaurant: string)
{
    let restaurantDishes = dishes.dishes
        .filter((dish) => dish.restaurant === restaurant && dish.availableMeals.includes(meal))

    return restaurantDishes
}