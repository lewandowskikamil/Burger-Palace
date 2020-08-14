import * as actionTypes from './actionTypes';

export const addCartItem = (item) => ({
    type: actionTypes.ADD_CART_ITEM,
    payload: item
})
export const removeCartItem = (id) => ({
    type: actionTypes.REMOVE_CART_ITEM,
    payload: id
})
export const updateCart = () => ({
    type: actionTypes.UPDATE_CART
})
export const clearCart = () => ({
    type: actionTypes.CLEAR_CART
})