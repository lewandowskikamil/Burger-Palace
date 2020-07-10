import * as actionTypes from './actionTypes';
import axios from 'axios';


export const authStart = () => ({
    type: actionTypes.AUTH_START
})
export const authSuccess = (token, userId) => ({
    type: actionTypes.AUTH_SUCCESS,
    idToken: token,
    userId
})
export const authFail = (error) => ({
    type: actionTypes.AUTH_FAIL,
    error
})
export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('expirationDate');
    localStorage.removeItem('userId');
    return { type: actionTypes.AUTH_LOGOUT }
}
export const checkAuthTimeout = expTime => dispatch => {
    setTimeout(() => {
        dispatch(logout())
    }, expTime * 1000)
}

export const auth = (email, password, isSignUp) => dispatch => {
    dispatch(authStart());
    const authData = {
        email,
        password,
        returnSecureToken: true
    }
    const apiKey = 'AIzaSyAMxNlI3hg-30CmO7MM2x4riGM50LivI1Q';
    const url = isSignUp ? (
        `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${apiKey}`
    ) : (
            `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`
        )
    axios.post(url, authData)
        .then(res => {
            const expirationDate = new Date(new Date().getTime() + res.data.expiresIn * 1000);
            localStorage.setItem('token', res.data.idToken);
            localStorage.setItem('expirationDate', expirationDate);
            localStorage.setItem('userId', res.data.localId);
            dispatch(authSuccess(res.data.idToken, res.data.localId));
            dispatch(checkAuthTimeout(res.data.expiresIn))
        })
        .catch(err => {
            console.log(err);
            dispatch(authFail(err.response.data.error));
        })

}

export const setAuthRedirectPath = path => ({
    type: actionTypes.SET_AUTH_REDIRECT_PATH,
    path
})
export const authCheckState = () => dispatch => {
    const token = localStorage.getItem('token');
    if (!token) return
    const expirationDate = new Date(localStorage.getItem('expirationDate'));
    if (expirationDate >= new Date()) {
        const userId = localStorage.getItem('userId');
        dispatch(authSuccess(token, userId));
        const authedTimeLeft = expirationDate - new Date();
        dispatch(checkAuthTimeout(authedTimeLeft / 1000))
    }
}