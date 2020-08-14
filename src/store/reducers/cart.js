import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../../shared/utility';

const initialState = {
    items: [],
    totalPrice: null
}

const addCartItem = (state, { payload }) => {
    const updatedItems = [...state.items];
    const index = updatedItems.findIndex(({ name, ingredients }) => (
        name === payload.name &&
        JSON.stringify(ingredients) === JSON.stringify(payload.ingredients)
    ))

    if (index === -1) updatedItems.push(payload);
    else {
        const updatedAmount = updatedItems[index].amount + 1;
        const unitPrice = updatedItems[index].price / updatedItems[index].amount;
        const updatedPrice = updatedAmount * unitPrice;
        const updatedItem = updateObject(updatedItems[index], {
            amount: updatedAmount,
            price: updatedPrice
        })
        updatedItems[index] = updatedItem;
    }

    const updatedTotalPrice = updatedItems.reduce((totalPrice, { price }) =>(
        totalPrice + price
    ), 0)
    const updatedCart = {
        items: updatedItems,
        totalPrice: updatedTotalPrice
    }
    localStorage.setItem('cart', JSON.stringify(updatedCart))
    return updatedCart;
}
const removeCartItem = (state, { payload }) => {
    let updatedItems;
    const itemAmount = state.items.find(({ id }) => id === payload).amount;

    if (itemAmount > 1) {
        updatedItems = state.items.map(item => {
            if (item.id === payload) {
                const updatedAmount = item.amount - 1;
                const unitPrice = item.price / item.amount;
                const updatedPrice = updatedAmount * unitPrice
                return {
                    ...item,
                    amount: updatedAmount,
                    price: updatedPrice
                }
            }
            return item
        })
    } else updatedItems = state.items.filter(({ id }) => id !== payload)

    const updatedTotalPrice = updatedItems.reduce((totalPrice, { price }) =>(
        totalPrice + price
    ), 0)
    const updatedCart = {
        items: updatedItems,
        totalPrice: updatedTotalPrice
    }
    
    localStorage.setItem('cart', JSON.stringify(updatedCart))
    return updatedCart
}
const updateCart = (state) => {
    const storageCart = localStorage.getItem('cart');
    if (storageCart) return JSON.parse(storageCart)
    return state;
}
const clearCart = () => {
    localStorage.removeItem('cart');
    return initialState;
}

const cart = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.ADD_CART_ITEM:
            return addCartItem(state, action);
        case actionTypes.REMOVE_CART_ITEM:
            return removeCartItem(state, action);
        case actionTypes.UPDATE_CART:
            return updateCart(state);
        case actionTypes.CLEAR_CART:
            return clearCart();
        default:
            return state;
    }
}

export default cart;