import * as actionTypes from '../actions/actionTypes';

const initialState = {
    ingredients: [],
    totalPrice: 0,
    purchasable: false,
}

const changeIngredientAmount = (state, action, isAdded) => {
    const { ingrName, ingrPrice } = action;
    const { ingredients, totalPrice } = state;
    let updatedIngredients;
    let updatedTotalPrice;
    let updatedPurchasable;
    if (isAdded) {
        updatedIngredients = [ingrName, ...ingredients];
        updatedTotalPrice = totalPrice + ingrPrice;
        updatedPurchasable = true;
    } else {
        const ingrIndex = ingredients.indexOf(ingrName);
        updatedIngredients = ingredients.filter((ingr, index) => index !== ingrIndex);
        updatedTotalPrice = totalPrice - ingrPrice;
        updatedPurchasable = !!updatedIngredients.length;
    }
    return {
        ingredients: updatedIngredients,
        totalPrice: updatedTotalPrice,
        purchasable: updatedPurchasable
    }
}

const burger = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.ADD_INGREDIENT:
            return changeIngredientAmount(state, action, true);
        case actionTypes.REMOVE_INGREDIENT:
            return changeIngredientAmount(state, action, false);
        case actionTypes.CLEAR_INGREDIENTS:
            return initialState
        case actionTypes.SET_INGREDIENTS:
            return {
                ingredients: action.ingredients,
                totalPrice: action.totalPrice,
                purchasable: true
            }
        default:
            return state;
    }
}
export default burger;