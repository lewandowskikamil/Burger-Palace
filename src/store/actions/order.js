import * as actionTypes from './actionTypes';
import { clearCart } from '../actions';

export const makeOrderSuccess = () => ({
    type: actionTypes.MAKE_ORDER_SUCCESS
})

export const makeOrderFail = error => ({
    type: actionTypes.MAKE_ORDER_FAIL,
    error
})
export const makeOrderStart = () => ({
    type: actionTypes.MAKE_ORDER_START
})

export const makeOrder = deliveryData => (dispatch, getState, { getFirebase }) => {
    dispatch(makeOrderStart())
    const firebase = getFirebase();
    const addOrder = firebase.functions().httpsCallable('addOrder');
    addOrder(deliveryData)
        .then(() => clearCart()(dispatch, getState, { getFirebase }))
        .then(() => dispatch(makeOrderSuccess()))
        .catch(() => dispatch(makeOrderFail()))
}