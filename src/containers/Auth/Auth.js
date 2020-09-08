import React, { useState } from 'react';
import { connect } from 'react-redux';
import Input from '../../components/UI/Input/Input';
import SlimButton from '../../components/UI/SlimButton/SlimButton';
import styles from './Auth.module.css';
import * as actions from '../../store/actions';
import Spinner from '../../components/UI/Spinner/Spinner';
import { Redirect } from 'react-router-dom';
import { updateObject, checkValidity } from '../../shared/utility';

const initialSignInData = {
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
const initialSignUpData = {
    ...initialSignInData,
    fullName: {
        elementType: 'input',
        elementLabel: 'Full name',
        elementConfig: {
            id: 'fullNameInput',
            type: 'text',
            placeholder: 'Your full name'
        },
        value: '',
        validation: {
            required: true,
            errorMessage: 'This field can\'t be empty'
        },
        valid: false,
        touched: false
    },
    address: {
        elementType: 'input',
        elementLabel: 'Address',
        elementConfig: {
            id: 'addressInput',
            type: 'text',
            placeholder: 'Your address'
        },
        value: '',
        validation: {
            required: true,
            errorMessage: 'This field can\'t be empty'
        },
        valid: false,
        touched: false
    },
    phoneNumber: {
        elementType: 'input',
        elementLabel: 'Phone number',
        elementConfig: {
            id: 'phoneNumberInput',
            type: 'text',
            placeholder: 'Your phone number'
        },
        value: '',
        validation: {
            required: true,
            isNumeric: true,
            minLength: 9,
            maxLength: 9,
            errorMessage: 'Phone number must consist of 9 digits'
        },
        valid: false,
        touched: false
    },
}


const Auth = ({
    onAuthUser,
    loading,
    error,
    isAuthed,
    history
}) => {
    const [isSignedUp, setIsSignedUp] = useState(false);
    const initialFormData = isSignedUp ? initialSignInData : initialSignUpData;
    const [formData, setFormData] = useState(initialFormData);
    const [isFormValid, setIsFormValid] = useState(false);
    const switchAuthModeHandler = () => {
        if (isSignedUp) setFormData(initialSignUpData);
        else setFormData(initialSignInData);
        setIsFormValid(false);
        setIsSignedUp(!isSignedUp);
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
        const { email, password, fullName, address, phoneNumber } = formData;
        e.preventDefault();
        if (isSignedUp) {
            onAuthUser(email.value, password.value, isSignedUp)
        } else {
            onAuthUser(email.value, password.value, isSignedUp, fullName.value, address.value, phoneNumber.value)
        }
    }

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
            <SlimButton btnType='success' disabled={!isFormValid}>{isSignedUp ? 'Sign In' : 'Sign Up'}</SlimButton>
        </form>
    )
    if (loading) form = <Spinner />
    let errorMessage = null;
    if (error) errorMessage = (
        <p>{error}</p>
    )
    if (isAuthed) {
        const { prevPath } = history.location.state || { prevPath: '/' };
        return <Redirect to={prevPath} />
    }

    return (
        <div className={styles.auth}>
            <h2>{isSignedUp ? 'Sign In' : 'Sign Up'}</h2>
            {errorMessage}
            {form}
            <SlimButton btnType='primary' clicked={switchAuthModeHandler}>Switch to {isSignedUp ? 'Sign Up' : 'Sign In'} Panel</SlimButton>
        </div>
    );
}
const mapStateToProps = ({
    auth: { loading, error },
    firebase: { auth }
}) => ({
    loading,
    error,
    isAuthed: !!auth.uid
})

const mapDispatchToProps = dispatch => ({
    onAuthUser: (email, password, isSignedUp, fullName, address, phoneNumber) => {
        dispatch(actions.auth(email, password, isSignedUp, fullName, address, phoneNumber))
    }
})

export default connect(mapStateToProps, mapDispatchToProps)(Auth);