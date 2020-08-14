import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../../shared/utility';

const initialState = {
    orders: [],
    filteredOrders: [],
    orderStats: {
        avgOrder: {
            avgBurgersAmount: null,
            avgOrderPrice: null
        },
        avgBurger: {
            avgBacon: null,
            avgCheese: null,
            avgMeat: null,
            avgSalad: null,
            avgBurgerPrice: null
        }
    },
    loading: false,
    error: null
}

// make it even leaner

const makeOrderSuccess = (state, action) => {
    const updatedOrders = state.orders.concat(
        updateObject(action.orderData, { id: action.orderId })
    )
    return updateObject(state, {
        loading: false,
        error: false,
        orders: updatedOrders
    })
}
const filterOrders = (state, { filters: { startDate, endDate, startPrice, endPrice } }) => {
    let filteredOrders;
    const timezoneOffset = new Date().getTimezoneOffset() * 60 * 1000;

    if (startDate) {
        filteredOrders = state.orders.filter(({ orderTimestamp }) => (
            orderTimestamp >= Date.parse(new Date(startDate)) + timezoneOffset
        ))
    }
    if (endDate) {
        filteredOrders = state.orders.filter(({ orderTimestamp }) => (
            orderTimestamp <= Date.parse(new Date(endDate)) + timezoneOffset + 24 * 60 * 60 * 1000 - 1
        ))
    }
    if (startPrice) {
        filteredOrders = state.orders.filter(({ totalPrice }) => (
            Number(totalPrice.toFixed(2)) >= Number(startPrice)
        ))
    }
    if (endPrice) {
        filteredOrders = state.orders.filter(({ totalPrice }) => (
            Number(totalPrice.toFixed(2)) <= Number(endPrice)
        ))
    }

    return updateObject(state, {
        filteredOrders
    })
}
const calculateOrderStats = (state) => {
    const filteredOrdersAmount = state.filteredOrders.length

    if (!filteredOrdersAmount) return updateObject(state, {
        orderStats: {
            avgOrder: { ...initialState.orderStats.avgOrder },
            avgBurger: { ...initialState.orderStats.avgBurger }
        }
    })

    const allCartItems = state.filteredOrders.reduce((itemsArr, { cartItems }) => (
        itemsArr.concat(cartItems)
    ), [])
    const totalBurgersAmount = allCartItems.reduce((totalAmount, { amount }) => (
        totalAmount + amount
    ), 0)
    const totalOrdersPrice = state.filteredOrders.reduce((sum, { totalPrice }) => (
        sum + totalPrice
    ), 0)
    const avgBurgersAmount = totalBurgersAmount / filteredOrdersAmount
    const avgOrderPrice = totalOrdersPrice / filteredOrdersAmount

    const avgOrder = {
        avgBurgersAmount,
        avgOrderPrice
    }
    const avgBurger = allCartItems.reduce((
        stats,
        { price, amount, ingredients: { bacon, cheese, meat, salad } },
        index,
        array
    ) => {
        stats.avgBacon += bacon * amount;
        stats.avgCheese += cheese * amount;
        stats.avgMeat += meat * amount;
        stats.avgSalad += salad * amount;
        stats.avgBurgerPrice += price;

        if (index === array.length - 1) {
            for (const statKey in stats) {
                stats[statKey] = stats[statKey] / totalBurgersAmount
            }
        }

        return stats
    }, {
        avgBacon: 0,
        avgCheese: 0,
        avgMeat: 0,
        avgSalad: 0,
        avgBurgerPrice: 0
    })

    return updateObject(state, {
        orderStats: {
            avgOrder,
            avgBurger
        }
    })
}

const order = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.MAKE_ORDER_START:
            return updateObject(state, { loading: true, error: null });
        case actionTypes.MAKE_ORDER_SUCCESS:
            return makeOrderSuccess(state, action)
        case actionTypes.MAKE_ORDER_FAIL:
            return updateObject(state, { loading: false, error: true });
        case actionTypes.CLEAR_ORDER_ERROR:
            return updateObject(state, { error: null });
        case actionTypes.FETCH_ORDERS_START:
            return updateObject(state, { loading: true, error: null });
        case actionTypes.FETCH_ORDERS_FAIL:
            return updateObject(state, {
                loading: false,
                error: true
            });
        case actionTypes.FETCH_ORDERS_SUCCESS:
            return updateObject(state, {
                loading: false,
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