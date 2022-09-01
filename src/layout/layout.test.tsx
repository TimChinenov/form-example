/* The follow tests excersize the validation and workflow of the form */

import { render, unmountComponentAtNode } from "react-dom"
import { fireEvent, screen } from '@testing-library/react'
import { act } from "react-dom/test-utils"
import Layout from './layout'

let container: any = null
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement("div")
  document.body.appendChild(container)
})

afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container)
  container.remove()
  container = null
})

it("throws an error when nothing has been selected", () => {
    // Arrange
    act(() => {
        render(<Layout />, container)
    })
    const nextButton = document.querySelector("[data-testid=next-button]")
    expect(nextButton).toBeTruthy()

    // Act
    act(() => {
        nextButton?.dispatchEvent(new MouseEvent("click", { bubbles: true }))
    })

    // Assert
    const errorMessages = document.querySelector("[data-testid=error-messages]")
    expect(errorMessages?.children.length).toBe(2)
})

it ("goes to step 2 when restaurant and number of people are selected", () => {
    // Arrange
    act(() => {
        render(<Layout />, container)
    })
    const mealDropdown = document.querySelector("[data-testid=select-meal]")
    const numberOfPeopleInput = document.querySelector("[data-testid=input-number-of-people]")
    const nextButton = document.querySelector("[data-testid=next-button]")
    expect(nextButton).toBeTruthy()
    expect(mealDropdown).toBeTruthy()
    expect(numberOfPeopleInput).toBeTruthy()

    // Act
    act(() => {
        fireEvent.change(mealDropdown!, { target: { name: "mealType", value: "lunch" }})
        fireEvent.change(numberOfPeopleInput!, { target: { name: "numberOfPeople", value: 1 }})
        nextButton?.dispatchEvent(new MouseEvent("click", { bubbles: true }))
    })

    // Assert
    const step2Welcome = screen.getByText("Choose a Restaurant")
    expect(step2Welcome).toBeInTheDocument()
})

it("throws an error when no resturante is selected", () => {
    // Arrange
    act(() => {
        render(<Layout />, container)
    })
    const mealDropdown = document.querySelector("[data-testid=select-meal]")
    const numberOfPeopleInput = document.querySelector("[data-testid=input-number-of-people]")
    const nextButton = document.querySelector("[data-testid=next-button]")
    expect(nextButton).toBeTruthy()
    expect(mealDropdown).toBeTruthy()
    expect(numberOfPeopleInput).toBeTruthy()

    act(() => {
        fireEvent.change(mealDropdown!, { target: { name: "mealType", value: "lunch" }})
        fireEvent.change(numberOfPeopleInput!, { target: { name: "numberOfPeople", value: 1 }})
        nextButton?.dispatchEvent(new MouseEvent("click", { bubbles: true }))
    })

    // Act
    act(() => {
        nextButton?.dispatchEvent(new MouseEvent("click", { bubbles: true }))
    })

    // Assert
    const step2Welcome = screen.getByText("Choose a Restaurant")
    expect(step2Welcome).toBeInTheDocument()
    const errorMessages = document.querySelector("[data-testid=error-messages]")
    expect(errorMessages?.children.length).toBe(1)
})

it("Goes to step 3 when restaurant is added", () => {
    // Arrange
    act(() => {
        render(<Layout />, container)
    })
    const mealDropdown = document.querySelector("[data-testid=select-meal]")
    const numberOfPeopleInput = document.querySelector("[data-testid=input-number-of-people]")
    const nextButton = document.querySelector("[data-testid=next-button]")
    expect(nextButton).toBeTruthy()
    expect(mealDropdown).toBeTruthy()
    expect(numberOfPeopleInput).toBeTruthy()

    act(() => {
        fireEvent.change(mealDropdown!, { target: { name: "mealType", value: "lunch" }})
        fireEvent.change(numberOfPeopleInput!, { target: { name: "numberOfPeople", value: 1 }})
        nextButton?.dispatchEvent(new MouseEvent("click", { bubbles: true }))
    })

    const selectRestaurant = document.querySelector("[data-testid=select-a-restaurant]")
    expect(selectRestaurant).toBeTruthy();

    // Act
    act(() => {
        fireEvent.change(selectRestaurant!, { target: { name: "restaurant", value: "Mc Donalds" }})
        nextButton?.dispatchEvent(new MouseEvent("click", { bubbles: true }))
    })

    // Assert
    const step3Welcome = screen.getByText("Choose Your Dishes")
    expect(step3Welcome).toBeInTheDocument()
    const errorMessages = document.querySelector("[data-testid=error-messages]")
    expect(errorMessages).toBeFalsy()
})


it("should throw an error if the number of dishes is less then the number of pepople", () => {
    // Arrange 
    GoToStep3();
    const nextButton = document.querySelector("[data-testid=next-button]")
    expect(nextButton).toBeTruthy()

    // Act
    act(() => {
        nextButton?.dispatchEvent(new MouseEvent("click", { bubbles: true }))
    })

    // Assert
    const step3Welcome = screen.getByText("Choose Your Dishes")
    expect(step3Welcome).toBeInTheDocument()
    const errorMessages = document.querySelector("[data-testid=error-messages]")
    expect(errorMessages?.children.length).toBe(1)
})

it("should go to the review page is the number of dishes is greater than or equal to the number of people", () => {
    // Arrange 
    GoToStep3();
    const nextButton = document.querySelector("[data-testid=next-button]")
    expect(nextButton).toBeTruthy()
    const selectDish = document.querySelector("[data-testid=selectdish]")
    expect(selectDish).toBeTruthy()

    // Act
    act(() => {
        fireEvent.change(selectDish!, { target: { value: 1 }})
    })
    const selectQuantity = document.querySelector("[data-testid=select-quantity]")
    expect(selectQuantity).toBeTruthy()
    act(() => {
        fireEvent.change(selectQuantity!, { target: { value: 5 }})
        fireEvent.blur(selectQuantity!)
        nextButton?.dispatchEvent(new MouseEvent("click", { bubbles: true }))
    })

    // Assert
    const reviewWelcome = screen.getByText("Review Your Order")
    expect(reviewWelcome).toBeInTheDocument()
    const errorMessages = document.querySelector("[data-testid=error-messages]")
    expect(errorMessages).toBeFalsy()
})

function GoToStep3() {
    act(() => {
        render(<Layout />, container)
    })
    const mealDropdown = document.querySelector("[data-testid=select-meal]")
    const numberOfPeopleInput = document.querySelector("[data-testid=input-number-of-people]")
    const nextButton = document.querySelector("[data-testid=next-button]")
    expect(nextButton).toBeTruthy()
    expect(mealDropdown).toBeTruthy()
    expect(numberOfPeopleInput).toBeTruthy()

    act(() => {
        fireEvent.change(mealDropdown!, { target: { name: "mealType", value: "lunch" }})
        fireEvent.change(numberOfPeopleInput!, { target: { name: "numberOfPeople", value: 5 }})
        nextButton?.dispatchEvent(new MouseEvent("click", { bubbles: true }))
    })

    const selectRestaurant = document.querySelector("[data-testid=select-a-restaurant]")
    expect(selectRestaurant).toBeTruthy();

    act(() => {
        fireEvent.change(selectRestaurant!, { target: { name: "restaurant", value: "Mc Donalds" }})
        nextButton?.dispatchEvent(new MouseEvent("click", { bubbles: true }))
    })
}

