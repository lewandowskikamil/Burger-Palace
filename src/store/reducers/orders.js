import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../../shared/utility';


const initialState = {
    savedFilters: {
        startDate: '',
        endDate: '',
        startPrice: '',
        endPrice: '',
    },
    filteredOrders: [],
    filteredOrdersBurgers: [],
    ordersStats: {
        avgBurgersAmount: null,
        avgOrderPrice: null
    },
    ordersBurgersStats: {
        avgBurgerPrice: null,
        avgIngredientsAmount: {
            allBurgers: {},
            customBurgers: {}
        },
        burgersContribution: {}
    },
    areStatsCalculated:false
}



const filterOrders = (state, { orders, ordersBurgers }) => {
    const { savedFilters: { startDate, endDate, startPrice, endPrice } } = state;
    let filteredOrders = orders
        .map(({ id, orderTimestamp: { seconds }, totalPrice }) => ({
            id,
            timestamp: seconds * 1000,
            orderPrice: totalPrice
        }))
    // get timezone offset in ms
    const timezoneOffset = new Date().getTimezoneOffset() * 60 * 1000;

    if (startDate) {
        filteredOrders = filteredOrders.filter(({ timestamp }) => (
            timestamp >= Date.parse(new Date(startDate)) + timezoneOffset
        ))
    }
    if (endDate) {
        filteredOrders = filteredOrders.filter(({ timestamp }) => (
            timestamp <= Date.parse(new Date(endDate)) + timezoneOffset + 24 * 60 * 60 * 1000 - 1
        ))
    }
    if (startPrice) {
        filteredOrders = filteredOrders.filter(({ orderPrice }) => (
            Number(orderPrice.toFixed(2)) >= Number(startPrice)
        ))
    }
    if (endPrice) {
        filteredOrders = filteredOrders.filter(({ orderPrice }) => (
            Number(orderPrice.toFixed(2)) <= Number(endPrice)
        ))
    }

    const filteredOrdersIds = filteredOrders.map(({ id }) => id);
    const filteredOrdersBurgers = ordersBurgers
        .filter(({ orderId }) => filteredOrdersIds.includes(orderId))
    // .map(burger => ({ ...burger, ingredients: [...burger.ingredients] }));

    return updateObject(state, {
        filteredOrders,
        filteredOrdersBurgers
    })
}
const calculateOrdersStats = state => {
    const { filteredOrders, filteredOrdersBurgers } = state;
    const ordersAmount = filteredOrders.length;
    const totalBurgersAmount = filteredOrdersBurgers
        .reduce((totalAmount, { amount }) => (
            totalAmount + amount
        ), 0)
    const totalOrdersCost = filteredOrders
        .reduce((totalCost, { orderPrice }) => (
            totalCost + orderPrice
        ), 0)
    const avgBurgersAmount = totalBurgersAmount / ordersAmount;
    const avgOrderPrice = totalOrdersCost / ordersAmount;

    const ordersStats = {
        avgBurgersAmount,
        avgOrderPrice
    }

    const avgBurgerPrice = totalOrdersCost / totalBurgersAmount;
    const ordersBurgersStats = {
        avgBurgerPrice,
        avgIngredientsAmount: {
            allBurgers: {},
            customBurgers: {}
        },
        burgersContribution: {}
    }

    const arraySet = filteredOrdersBurgers
        .reduce((arraySet, { name, amount, ingredients }) => {
            const burgerNames = [];
            let burgerIngredients = [];
            let custBurgerIngredients = []
            for (let i = 0; i < amount; i++) {
                burgerNames.push(name);
                burgerIngredients = burgerIngredients.concat(ingredients);
                if (name === 'Custom burger') {
                    custBurgerIngredients = custBurgerIngredients.concat(ingredients);
                }
            }
            return [
                arraySet[0].concat(burgerNames),
                arraySet[1].concat(burgerIngredients),
                arraySet[2].concat(custBurgerIngredients)
            ]
        }, [[], [], []]);
    const [allBurgerNames, allIngredients, allCustomIngredients] = arraySet;
    const [uniqueNames, uniqueIngredients, uniqueCustomIngredients] = arraySet
        .map(arr => new Set(arr));

    const totalCustomBurgersAmount = filteredOrdersBurgers
        .reduce((totalAmount, { amount, name }) => (
            name === 'Custom burger' ? totalAmount + amount : totalAmount
        ), 0)

    uniqueNames.forEach(burgerType => {
        const burgerTypeAmount = allBurgerNames
            .filter(name => name === burgerType).length;
        const burgerTypeKey = burgerType
            .split(' ')
            .map((word, index) => {
                if (index) return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
                return word.toLowerCase()
            })
            .join('');
        ordersBurgersStats.burgersContribution[burgerTypeKey] = burgerTypeAmount;
    })

    const ingredientArrays = [uniqueIngredients, uniqueCustomIngredients];
    ingredientArrays.forEach((ingrArr, index) => {
        ingrArr.forEach(uniqueIngr => {
            let arrayToFilter = allIngredients;
            if (index) arrayToFilter = allCustomIngredients;
            const ingrTotalAmount = arrayToFilter
                .filter(ingr => ingr === uniqueIngr).length;
            let ingrAverageAmount = ingrTotalAmount / totalBurgersAmount;
            if (index) ingrAverageAmount = ingrTotalAmount / totalCustomBurgersAmount;
            const uniqueIngrCapitalized = uniqueIngr.charAt(0).toUpperCase() + uniqueIngr.slice(1);
            const pathPieces = [`${index ? 'customBurgers' : 'allBurgers'}`, `avg${uniqueIngrCapitalized}Amount`];
            ordersBurgersStats.avgIngredientsAmount[pathPieces[0]][pathPieces[1]] = ingrAverageAmount;
        })
    })

    return updateObject(state, {
        ordersStats,
        ordersBurgersStats,
        areStatsCalculated:true
    })
}
const setOrdersFilters = (state, { filters }) => updateObject(state, {
    savedFilters: filters
})

const orders = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.FILTER_ORDERS:
            return filterOrders(state, action);
        case actionTypes.CALCULATE_ORDERS_STATS:
            return calculateOrdersStats(state);
        case actionTypes.SET_ORDERS_FILTERS:
            return setOrdersFilters(state, action);
        default:
            return state;
    }
}
export default orders;