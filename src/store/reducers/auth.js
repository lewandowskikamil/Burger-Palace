import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../../shared/utility';

const initialState = {
    token: null,
    userId: null,
    error: null,
    loading: false,
    authRedirectPath:'/'
}

const authStart = (state) => updateObject(state, {
    loading: true,
    error: null
})
const authSuccess = (state, action) => updateObject(state, {
    token: action.idToken,
    userId: action.userId,
    loading: false
})
const authFail = (state, action) => updateObject(state, {
    loading: false,
    error: action.error
})
const authLogout = (state) => updateObject(state, {
    token: null,
    userId: null
})
const setAuthRedirectPath = (state, action) => updateObject(state, {
    authRedirectPath: action.path
})
const auth = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.AUTH_START:
            return authStart(state)
        case actionTypes.AUTH_SUCCESS:
            return authSuccess(state, action)
        case actionTypes.AUTH_FAIL:
            return authFail(state, action)
        case actionTypes.AUTH_LOGOUT:
            return authLogout(state)
        case actionTypes.SET_AUTH_REDIRECT_PATH:
            return setAuthRedirectPath(state, action)
        default:
            return state;
    }
}

export default auth;