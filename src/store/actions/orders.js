import * as actionTypes from './actionTypes';

export const filterOrders = (orders, ordersBurgers) => ({
    type: actionTypes.FILTER_ORDERS,
    orders,
    ordersBurgers
})
export const calculateOrdersStats = () => ({
    type: actionTypes.CALCULATE_ORDERS_STATS
})
export const setOrdersFilters = filters => ({
    type: actionTypes.SET_ORDERS_FILTERS,
    filters
})