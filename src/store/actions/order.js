import * as actionTypes from './actionTypes';
import axios from '../../axios-orders';

export const purchaseBurgerSuccess = (id, orderData) => ({
    type: actionTypes.PURCHASE_BURGER_SUCCESS,
    orderId: id,
    orderData
})

export const purchaseBurgerFail = (error) => ({
    type: actionTypes.PURCHASE_BURGER_FAIL,
    error
})
export const purchaseBurgerStart = () => ({
    type: actionTypes.PURCHASE_BURGER_START
})
export const purchaseInit = () => ({
    type: actionTypes.PURCHASE_INIT
})
export const purchaseBurger = (orderData, token) => dispatch => {
    dispatch(purchaseBurgerStart())
    axios.post(`/orders.json?auth=${token}`, orderData)
        .then(res => {
            dispatch(purchaseBurgerSuccess(res.data.name, orderData));
        })
        .catch(err => {
            dispatch(purchaseBurgerFail(err))
        })
}

export const fetchOrdersStart = () => ({
    type: actionTypes.FETCH_ORDERS_START
})
export const fetchOrdersSuccess = (orders) => ({
    type: actionTypes.FETCH_ORDERS_SUCCESS,
    orders
})
export const fetchOrdersFail = (error) => ({
    type: actionTypes.FETCH_ORDERS_FAIL,
    error
})
export const fetchOrders = (token, userId) => dispatch => {
    dispatch(fetchOrdersStart())
    const queryParams=`?auth=${token}&orderBy="userId"&equalTo="${userId}"`
    axios.get(`/orders.json${queryParams}`)
        .then(res => {
            const orders = []
            for (const key in res.data) {
                orders.push({ ...res.data[key], id: key })
            }
            dispatch(fetchOrdersSuccess(orders))
        })
        .catch(err => {
            dispatch(fetchOrdersFail())
        })
}