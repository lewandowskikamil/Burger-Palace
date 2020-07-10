import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../../shared/utility';

const initialState = {
    orders: [],
    loading: false,
    purchased: false,
    error: false
}

// make it even leaner

const purchaseBurgerSuccess = (state, action) => {
    const updatedOrders = state.orders.concat(
        updateObject(action.orderData, { id: action.orderId })
    )
    return updateObject(state, {
        loading: false,
        purchased: true,
        orders: updatedOrders
    })
}

const order = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.PURCHASE_INIT:
            return updateObject(state, { purchased: false });
        case actionTypes.PURCHASE_BURGER_START:
            return updateObject(state, { loading: true });
        case actionTypes.PURCHASE_BURGER_SUCCESS:
            return purchaseBurgerSuccess(state, action)
        case actionTypes.PURCHASE_BURGER_FAIL:
            return updateObject(state, { loading: false });
        case actionTypes.FETCH_ORDERS_START:
            return updateObject(state, { loading: true });
        case actionTypes.FETCH_ORDERS_FAIL:
            return updateObject(state, {
                loading: false,
                error: true
            });
        case actionTypes.FETCH_ORDERS_SUCCESS:
            return updateObject(state, {
                loading: false,
                error: false,
                orders: action.orders
            });
        default:
            return state;
    }
}
export default order;