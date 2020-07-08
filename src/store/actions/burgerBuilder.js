import * as actionTypes from './actionTypes';
import axios from '../../axios-orders';

export const addIngredient = (ingredientName) => ({
    type: actionTypes.ADD_INGREDIENT,
    payload: ingredientName
})
export const removeIngredient = (ingredientName) => ({
    type: actionTypes.REMOVE_INGREDIENT,
    payload: ingredientName
})

export const setIngredients = (ingredients) => ({
    type: actionTypes.SET_INGREDIENTS,
    payload: ingredients
})

export const fetchIngredientsFailed=()=>({type:actionTypes.FETCH_INGREDIENTS_FAILED})

export const initIngredients = () => (dispatch) => {
    axios.get('/ingredients.json')
        .then(res => {
            dispatch(setIngredients(res.data))
        })
        .catch(err => {
            dispatch(fetchIngredientsFailed())
        })
}