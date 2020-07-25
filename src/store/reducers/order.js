import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../../shared/utility';
// import { calculateOrderStats } from '../actions/order';

const initialState = {
    orders: [],
    filteredOrders: [],
    orderStats: {
        avgBacon: null,
        avgCheese: null,
        avgMeat: null,
        avgSalad: null,
        avgPrice: null
    },
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
const filterOrders = (state, { filters: { startDate, endDate, startPrice, endPrice } }) => {
    let filteredOrders = [...state.orders];
    const timezoneOffset = new Date().getTimezoneOffset() * 60 * 1000;
    if (startDate) {
        filteredOrders = filteredOrders.filter(({ orderDate }) => (
            orderDate >= Date.parse(new Date(startDate)) + timezoneOffset
        ))
    }
    if (endDate) {
        filteredOrders = filteredOrders.filter(({ orderDate }) => (
            orderDate <= Date.parse(new Date(endDate)) + timezoneOffset + 24 * 60 * 60 * 1000 - 1
        ))
    }
    if (startPrice) {
        filteredOrders = filteredOrders.filter(({ price }) => (
            Number(price.toFixed(2)) >= Number(startPrice)
        ))
    }
    if (endPrice) {
        filteredOrders = filteredOrders.filter(({ price }) => (
            Number(price.toFixed(2)) <= Number(endPrice)
        ))
    }
    return updateObject(state, {
        filteredOrders
    })
}
const calculateOrderStats = (state) => {
    if (!state.filteredOrders.length) return updateObject(state, {
        orderStats: { ...initialState.orderStats }
    })
    const orderStats = state.filteredOrders.reduce((
        stats,
        { price, ingredients: { bacon, cheese, meat, salad } },
        index,
        array
    ) => {
        stats.avgBacon += bacon;
        stats.avgCheese += cheese;
        stats.avgMeat += meat;
        stats.avgSalad += salad;
        stats.avgPrice += price;
        if (index === array.length - 1) {
            for (const stat in stats) {
                stats[stat] = stats[stat] / array.length
            }
        }
        return stats
    }, {
        avgBacon: 0,
        avgCheese: 0,
        avgMeat: 0,
        avgSalad: 0,
        avgPrice: 0
    })
    return updateObject(state, {
        orderStats
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
        case actionTypes.SET_FILTERED_ORDERS:
            return updateObject(state, {
                filteredOrders: action.filteredOrders
            });
        case actionTypes.FILTER_ORDERS:
            return filterOrders(state, action);
        case actionTypes.CALCULATE_ORDER_STATS:
            return calculateOrderStats(state);
        default:
            return state;
    }
}
export default order;