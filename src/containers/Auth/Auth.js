import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import Input from '../../components/UI/Input/Input';
import Button from '../../components/UI/Button/Button';
import styles from './Auth.module.css';
import * as actions from '../../store/actions';
import Spinner from '../../components/UI/Spinner/Spinner';
import { Redirect } from 'react-router-dom';
import { updateObject, checkValidity } from '../../shared/utility';


const initialFormData = {
    email: {
        elementType: 'input',
        elementLabel: 'Email',
        elementConfig: {
            id: 'emailInput',
            type: 'email',
            placeholder: 'Your email'
        },
        value: '',
        validation: {
            required: true,
            isEmail: true,
            errorMessage: 'It must be a valid email, don\'t fuck with me.'
        },
        valid: false,
        touched: false
    },
    password: {
        elementType: 'input',
        elementLabel: 'Password',
        elementConfig: {
            id: 'passwordInput',
            type: 'password',
            placeholder: 'Your password'
        },
        value: '',
        validation: {
            required: true,
            minLength: 6,
            errorMessage: 'Password must be at least 6 characters long.'
        },
        valid: false,
        touched: false
    },
}


const Auth = ({
    onAuth,
    purchasable,
    authRedirectPath,
    onSetAuthRedirectPath,
    loading,
    error,
    isAuthed
}) => {
    const [formData, setFormData] = useState(initialFormData);
    const [isFormValid, setIsFormValid] = useState(false);
    const [isSignUp, setIsSignUp] = useState(false);
    const switchAuthModeHandler = () => {
        setIsSignUp(!isSignUp)
    }
    const inputChangeHandler = (e) => {
        const { [e.target.name]: formElement } = formData;
        const updatedFormElement = updateObject(formElement, {
            value: e.target.value,
            valid: checkValidity(
                e.target.value, formElement.validation
            )
        })
        if (!updatedFormElement.touched) updatedFormElement.touched = true
        const updatedFormData = updateObject(formData, {
            [e.target.name]: updatedFormElement
        })
        if (isFormValid === updatedFormElement.valid) {
            setFormData(updatedFormData);
        } else {
            let isFormValid = true;
            for (const inputIdentifier in updatedFormData) {
                if (!updatedFormData[inputIdentifier].valid && isFormValid) {
                    isFormValid = false
                }
            }
            setFormData(updatedFormData);
            setIsFormValid(isFormValid);
        }
    }

    const submitHandler = (e) => {
        const { email, password } = formData;
        e.preventDefault();
        onAuth(email.value, password.value, isSignUp)
    }

    useEffect(() => {
        if (!purchasable && authRedirectPath !== '/') onSetAuthRedirectPath('/');
    }, [purchasable, authRedirectPath, onSetAuthRedirectPath])

    const formElementsArray = Object.keys(formData)
        .map(elKey => ({
            ...formData[elKey],
            elementConfig: {
                ...formData[elKey].elementConfig,
                name: elKey
            }
        }))
        .map(element => (
            <Input
                key={element.elementConfig.name}
                changed={inputChangeHandler}
                {...element}
            />
        ))
    let form = (
        <form onSubmit={submitHandler}>
            {formElementsArray}
            <Button btnType='success' disabled={!isFormValid}>{isSignUp ? 'Sign Up' : 'Sign In'}</Button>
        </form>
    )
    if (loading) form = <Spinner />
    let errorMessage = null;
    if (error) errorMessage = (
        <p>{error.message}</p>
    )
    if (isAuthed) return <Redirect to={authRedirectPath} />

    return (
        <div className={styles.auth}>
            <h2>{isSignUp ? 'Sign Up' : 'Sign In'}</h2>
            {errorMessage}
            {form}
            <Button btnType='danger' clicked={switchAuthModeHandler}>Switch to {isSignUp ? 'Sign In' : 'Sign Up'} Panel</Button>
        </div>
    );
}
const mapStateToProps = ({
    auth: { loading, error, token, authRedirectPath },
    burger: { purchasable }
}) => ({
    loading,
    error,
    isAuthed: !!token,
    purchasable,
    authRedirectPath
})

const mapDispatchToProps = dispatch => ({
    onAuth: (email, password, isSignUp) => {
        dispatch(actions.auth(email, password, isSignUp))
    },
    onSetAuthRedirectPath: (path) => {
        dispatch(actions.setAuthRedirectPath(path))
    }
})

export default connect(mapStateToProps, mapDispatchToProps)(Auth);