import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../../shared/utility';

const initialState = {
    error: null,
    loading: false
}

const cart = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.ADD_ITEM_START:
            return {
                loading: true,
                error: null
            }
        case actionTypes.ADD_ITEM_SUCCESS:
            return {
                loading: false,
                error: false
            }
        case actionTypes.ADD_ITEM_FAIL:
            return {
                loading: false,
                error: true
            }
        case actionTypes.REMOVE_ITEM_START:
            return {
                loading: true,
                error: null
            }
        case actionTypes.REMOVE_ITEM_SUCCESS:
            return {
                loading: false,
                error: false
            }
        case actionTypes.REMOVE_ITEM_FAIL:
            return {
                loading: false,
                error: true
            }
        case actionTypes.CLEAR_CART_START:
            return {
                loading: true,
                error: null
            }
        case actionTypes.CLEAR_CART_SUCCESS:
            return {
                loading: false,
                error: false
            }
        case actionTypes.CLEAR_CART_FAIL:
            return {
                loading: false,
                error: true
            }
        case actionTypes.REMOVE_CART_ERROR:
            return updateObject(state, {
                error: null
            });
        default:
            return state;
    }
}

export default cart;