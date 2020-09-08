import * as actionTypes from '../actions/actionTypes';

const initialState = {
    loading: false,
    error: null
}

const order = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.MAKE_ORDER_START:
            return { loading: true, error: null }
        case actionTypes.MAKE_ORDER_SUCCESS:
            return { loading: false, error: false }
        case actionTypes.MAKE_ORDER_FAIL:
            return { loading: false, error: true }
        default:
            return state;
    }
}
export default order;