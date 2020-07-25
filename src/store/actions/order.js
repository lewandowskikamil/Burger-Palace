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
export const setFilteredOrders=(filteredOrders)=>({
    type: actionTypes.SET_FILTERED_ORDERS,
    filteredOrders
})
export const calculateOrderStats=()=>({
    type:actionTypes.CALCULATE_ORDER_STATS
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
            dispatch(setFilteredOrders(orders))
            dispatch(calculateOrderStats())
        })
        .catch(err => {
            dispatch(fetchOrdersFail())
        })
}
export const filterOrders=(filters)=>({
    type:actionTypes.FILTER_ORDERS,
    filters
})
export const changeOrderFilters=filters=>dispatch=>{
    dispatch(filterOrders(filters));
    dispatch(calculateOrderStats())
}