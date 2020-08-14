import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../../shared/utility';

export const INGREDIENTS_PRICES = {
    salad: 0.5,
    bacon: 0.4,
    cheese: 1.3,
    meat: 0.7,
}

const initialState = {
    ingredients: {
        bacon: 0,
        cheese: 0,
        meat: 0,
        salad: 0
    },
    totalPrice: 4,
    purchasable: false,
}

const changeIngredientAmount = (state, ingrName, isAdded) => {
    const { ingredients, totalPrice: price } = state;
    const ingrPrice = INGREDIENTS_PRICES[ingrName];
    const updatedIngredient = {
        [ingrName]: isAdded ? ingredients[ingrName] + 1 : ingredients[ingrName] - 1
    }
    const updatedIngredients = updateObject(ingredients, updatedIngredient)
    const updatedPrice = isAdded ? price + ingrPrice : price - ingrPrice;
    const updatedPurchasable = !!Object.keys(updatedIngredients)
        .map(igKey => updatedIngredients[igKey])
        .reduce((sum, el) => sum + el, 0)

    return updateObject(state, {
        ingredients: updatedIngredients,
        totalPrice: updatedPrice,
        purchasable: updatedPurchasable
    })
}

const burger = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.ADD_INGREDIENT:
            return changeIngredientAmount(state, action.payload, true);
        case actionTypes.REMOVE_INGREDIENT:
            return changeIngredientAmount(state, action.payload, false);
        case actionTypes.CLEAR_INGREDIENTS:
            return initialState
        default:
            return state;
    }
}
export default burger;