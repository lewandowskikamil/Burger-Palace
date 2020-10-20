import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../../shared/utility';

const initialState = {
    loading: false,
    error: null,
    burgerData: null
}

const admin = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.UPDATE_PRICES_START:
            return updateObject(state, {
                loading: true,
                error: null
            })
        case actionTypes.UPDATE_PRICES_SUCCESS:
            return updateObject(state, {
                loading: false,
                error: false
            })
        case actionTypes.UPDATE_PRICES_FAIL:
            return updateObject(state, {
                loading: false,
                error: true
            })
        case actionTypes.CHANGE_ROLE_START:
            return updateObject(state, {
                loading: true,
                error: null
            })
        case actionTypes.CHANGE_ROLE_SUCCESS:
            return updateObject(state, {
                loading: false,
                error: false
            })
        case actionTypes.CHANGE_ROLE_FAIL:
            return updateObject(state, {
                loading: false,
                error: true
            })
        case actionTypes.ADD_MENU_ITEM_START:
            return updateObject(state, {
                loading: true,
                error: null
            })
        case actionTypes.ADD_MENU_ITEM_SUCCESS:
            return updateObject(state, {
                loading: false,
                error: false
            })
        case actionTypes.ADD_MENU_ITEM_FAIL:
            return updateObject(state, {
                loading: false,
                error: true
            })
        case actionTypes.REMOVE_MENU_ITEM_START:
            return updateObject(state, {
                loading: true,
                error: null
            })
        case actionTypes.REMOVE_MENU_ITEM_SUCCESS:
            return updateObject(state, {
                loading: false,
                error: false
            })
        case actionTypes.REMOVE_MENU_ITEM_FAIL:
            return updateObject(state, {
                loading: false,
                error: true
            })
        case actionTypes.UPDATE_MENU_ITEM_START:
            return updateObject(state, {
                loading: true,
                error: null
            })
        case actionTypes.UPDATE_MENU_ITEM_SUCCESS:
            return updateObject(state, {
                loading: false,
                error: false
            })
        case actionTypes.UPDATE_MENU_ITEM_FAIL:
            return updateObject(state, {
                loading: false,
                error: true
            })
        case actionTypes.SET_BURGER_DATA:
            return updateObject(state, {
                burgerData: action.burgerData
            });
        case actionTypes.CLEAR_BURGER_DATA:
            return updateObject(state, {
                burgerData: null
            });
        default:
            return state;
    }
}
export default admin;