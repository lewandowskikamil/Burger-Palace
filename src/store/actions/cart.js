import * as actionTypes from './actionTypes';

export const addItemStart = () => ({
    type: actionTypes.ADD_ITEM_START
})
export const addItemSuccess = () => ({
    type: actionTypes.ADD_ITEM_SUCCESS
})
export const addItemFail = () => ({
    type: actionTypes.ADD_ITEM_FAIL
})
export const removeItemStart = () => ({
    type: actionTypes.REMOVE_ITEM_START
})
export const removeItemSuccess = () => ({
    type: actionTypes.REMOVE_ITEM_SUCCESS
})
export const removeItemFail = () => ({
    type: actionTypes.REMOVE_ITEM_FAIL
})
export const clearCartStart = () => ({
    type: actionTypes.CLEAR_CART_START
})
export const clearCartSuccess = () => ({
    type: actionTypes.CLEAR_CART_SUCCESS
})
export const clearCartFail = () => ({
    type: actionTypes.CLEAR_CART_FAIL
})
export const removeCartError = () => ({
    type: actionTypes.REMOVE_CART_ERROR
})

export const addItem = item => (dispatch, getState, { getFirebase }) => {
    dispatch(addItemStart());
    const firebase = getFirebase();
    const addToCart = firebase.functions().httpsCallable('addToCart');
    addToCart(item)
        .then(() => dispatch(addItemSuccess()))
        .catch(err => {
            console.log(err);
            dispatch(addItemFail(err));
        })
}
export const removeItem = itemId => (dispatch, getState, { getFirebase }) => {
    dispatch(removeItemStart());
    const firebase = getFirebase();
    const removeFromCart = firebase.functions().httpsCallable('removeFromCart');
    removeFromCart(itemId)
        .then(() => dispatch(removeItemSuccess()))
        .catch(err => {
            console.log(err);
            dispatch(dispatch(removeItemFail(err)))
        })
}

export const clearCart = () => (dispatch, getState, { getFirebase }) => {
    dispatch(clearCartStart());
    const firebase = getFirebase();
    const resetCart = firebase.functions().httpsCallable('resetCart');
    resetCart()
        .then(() => dispatch(clearCartSuccess()))
        .catch(err => {
            console.log(err);
            dispatch(clearCartFail(err))
        })
}