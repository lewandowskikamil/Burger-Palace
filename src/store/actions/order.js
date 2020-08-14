import * as actionTypes from './actionTypes';
import axios from '../../axios-orders';

export const makeOrderSuccess = (id, orderData) => ({
    type: actionTypes.MAKE_ORDER_SUCCESS,
    orderId: id,
    orderData
})

export const makeOrderFail = (error) => ({
    type: actionTypes.MAKE_ORDER_FAIL,
    error
})
export const makeOrderStart = () => ({
    type: actionTypes.MAKE_ORDER_START
})

export const makeOrder = orderData => dispatch => {
    dispatch(makeOrderStart())
    axios.post('/orders.json', orderData)
        .then(res => {
            dispatch(makeOrderSuccess(res.data.name, orderData));
        })
        .catch(err => {
            dispatch(makeOrderFail(err))
        })
}

export const clearOrderError = () => ({
    type: actionTypes.CLEAR_ORDER_ERROR
})
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
export const setFilteredOrders = (filteredOrders) => ({
    type: actionTypes.SET_FILTERED_ORDERS,
    filteredOrders
})
export const calculateOrderStats = () => ({
    type: actionTypes.CALCULATE_ORDER_STATS
})
export const fetchOrders = (token, userId) => dispatch => {
    dispatch(fetchOrdersStart())
    const queryParams = `?auth=${token}&orderBy="userId"&equalTo="${userId}"`
    axios.get(`/orders.json${queryParams}`)
        .then(res => {
            const orders = []
            for (const key in res.data) {
                orders.push({ ...res.data[key], id: key })
            }
            dispatch(fetchOrdersSuccess(orders))
            dispatch(setFilteredOrders(orders))
            dispatch(calculateOrderStats())
        })
        .catch(err => {
            console.log('been there');
            dispatch(fetchOrdersFail(err))
        })
}
export const filterOrders = (filters) => ({
    type: actionTypes.FILTER_ORDERS,
    filters
})
export const changeOrderFilters = filters => dispatch => {
    dispatch(filterOrders(filters));
    dispatch(calculateOrderStats())
}