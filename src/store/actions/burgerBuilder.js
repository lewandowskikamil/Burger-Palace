import * as actionTypes from './actionTypes';

export const addIngredient = (ingrName, ingredientPrice) => (dispatch, getState) => {
    const totalPrice = getState().burgerBuilder.totalPrice;
    // if total price in burger reducer equals 0, burger configuration hasn't started yet
    // in such a case include bun (bread) cost, which is the base price
    // then start calculating ingredients cost
    let ingrPrice = ingredientPrice;
    if (!totalPrice) {
        const basePrice = getState().firestore.data.prices.bun;
        ingrPrice += basePrice;
    }
    dispatch({
        type: actionTypes.ADD_INGREDIENT,
        ingrName,
        ingrPrice
    })
}
export const removeIngredient = (ingrName, ingrPrice) => ({
    type: actionTypes.REMOVE_INGREDIENT,
    ingrName,
    ingrPrice
})
export const clearIngredients = () => ({
    type: actionTypes.CLEAR_INGREDIENTS
})
export const setIngredients = (ingredients, totalPrice) => ({
    type: actionTypes.SET_INGREDIENTS,
    ingredients,
    totalPrice
})