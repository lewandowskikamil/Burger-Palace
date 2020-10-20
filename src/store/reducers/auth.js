import * as actionTypes from '../actions/actionTypes';

const initialState = {
    error: null,
    loading: false
}

const auth = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.AUTH_START:
            return {
                loading: true,
                error: null
            }
        case actionTypes.AUTH_SUCCESS:
            return {
                loading: false,
                error: false
            }
        case actionTypes.AUTH_FAIL:
            return {
                loading: false,
                error: action.error.message
            }
        default:
            return state;
    }
}

export default auth;