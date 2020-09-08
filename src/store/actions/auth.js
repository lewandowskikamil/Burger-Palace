import * as actionTypes from './actionTypes';


export const authStart = () => ({
    type: actionTypes.AUTH_START
})
export const authSuccess = () => ({
    type: actionTypes.AUTH_SUCCESS
})
export const authFail = error => ({
    type: actionTypes.AUTH_FAIL,
    error
})
export const signoutStart = () => ({
    type: actionTypes.SIGNOUT_START
})
export const signoutSuccess = () => ({
    type: actionTypes.SIGNOUT_SUCCESS
})
export const signoutFail = error => ({
    type: actionTypes.SIGNOUT_FAIL,
    error
})
export const signout = () => (dispatch, getState, { getFirebase }) => {
    dispatch(signoutStart());
    const firebase = getFirebase();
    firebase.auth().signOut()
        .then(() => signoutSuccess())
        .catch(err => {
            console.log(err);
            dispatch(signoutFail())
        })
}

export const auth = (
    email,
    password,
    isSignedUp,
    fullName,
    address,
    phoneNumber
) => (dispatch, getState, { getFirebase, getFirestore }) => {
    dispatch(authStart());
    const firebase = getFirebase();
    const firestore = getFirestore();
    if (isSignedUp) {
        firebase.auth().signInWithEmailAndPassword(email, password)
            .then(() => dispatch(authSuccess()))
            .catch(err => dispatch(authFail(err)))
    } else {
        firebase.auth().createUserWithEmailAndPassword(email, password)
            .then(cred => {
                return firestore.collection('users').doc(cred.user.uid).set({
                    fullName,
                    address,
                    phoneNumber,
                    role:'user'
                })
            })
            .then(() => dispatch(authSuccess()))
            .catch(err => {
                console.log(err);
                dispatch(authFail(err));
            })
    }
}