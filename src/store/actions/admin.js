import * as actionTypes from './actionTypes';

export const updatePricesStart = () => ({
    type: actionTypes.UPDATE_PRICES_START
})
export const updatePricesSuccess = () => ({
    type: actionTypes.UPDATE_PRICES_SUCCESS
})
export const updatePricesFail = error => ({
    type: actionTypes.UPDATE_PRICES_FAIL,
    error
})
export const changeRoleStart = () => ({
    type: actionTypes.CHANGE_ROLE_START
})
export const changeRoleSuccess = () => ({
    type: actionTypes.CHANGE_ROLE_SUCCESS
})
export const changeRoleFail = error => ({
    type: actionTypes.CHANGE_ROLE_FAIL,
    error
})
export const addMenuItemStart = () => ({
    type: actionTypes.ADD_MENU_ITEM_START
})
export const addMenuItemSuccess = () => ({
    type: actionTypes.ADD_MENU_ITEM_SUCCESS
})
export const addMenuItemFail = error => ({
    type: actionTypes.ADD_MENU_ITEM_FAIL,
    error
})
export const removeMenuItemStart = () => ({
    type: actionTypes.REMOVE_MENU_ITEM_START
})
export const removeMenuItemSuccess = () => ({
    type: actionTypes.REMOVE_MENU_ITEM_SUCCESS
})
export const removeMenuItemFail = error => ({
    type: actionTypes.REMOVE_MENU_ITEM_FAIL,
    error
})
export const updateMenuItemStart = () => ({
    type: actionTypes.UPDATE_MENU_ITEM_START
})
export const updateMenuItemSuccess = () => ({
    type: actionTypes.UPDATE_MENU_ITEM_SUCCESS
})
export const updateMenuItemFail = error => ({
    type: actionTypes.UPDATE_MENU_ITEM_FAIL,
    error
})

export const updatePrices = updatedPrices => (
    dispatch, getState, { getFirebase }
) => {
    dispatch(updatePricesStart());
    const firebase = getFirebase();
    const changePrices = firebase.functions().httpsCallable('changeIngredientPrices');
    changePrices(updatedPrices)
        .then(() => dispatch(updatePricesSuccess()))
        .catch(err => dispatch(updatePricesFail(err)))
}
export const changeRole = (userId, operationType) => (
    dispatch, getState, { getFirebase }
) => {
    dispatch(changeRoleStart());
    const firebase = getFirebase();
    const changeUserRole = firebase.functions().httpsCallable('changeUserRole');
    const data = {
        userId,
        operationType
    };
    changeUserRole(data)
        .then(() => dispatch(changeRoleSuccess()))
        .catch(err => dispatch(changeRoleFail(err)))
}
export const addMenuItem = data => (dispatch, getState, { getFirebase }) => {
    dispatch(addMenuItemStart());
    const firebase = getFirebase();
    const addToMenu = firebase.functions().httpsCallable('addToMenu');
    addToMenu(data)
        .then(() => dispatch(addMenuItemSuccess()))
        .catch(err => dispatch(addMenuItemFail(err)))
}
export const removeMenuItem = id => (dispatch, getState, { getFirebase }) => {
    dispatch(removeMenuItemStart());
    const firebase = getFirebase();
    const removeFromMenu = firebase.functions().httpsCallable('removeFromMenu');
    removeFromMenu(id)
        .then(() => dispatch(removeMenuItemSuccess()))
        .catch(err => dispatch(removeMenuItemFail(err)))
}
export const updateMenuItem = data => (dispatch, getState, { getFirebase }) => {
    dispatch(updateMenuItemStart());
    const firebase = getFirebase();
    const updateItem = firebase.functions().httpsCallable('updateMenuItem');
    updateItem(data)
        .then(() => dispatch(updateMenuItemSuccess()))
        .catch(err => dispatch(updateMenuItemFail(err)))
}
export const setBurgerData = (burgerData) => ({
    type: actionTypes.SET_BURGER_DATA,
    burgerData
})
export const clearBurgerData = () => ({
    type: actionTypes.CLEAR_BURGER_DATA,
})
