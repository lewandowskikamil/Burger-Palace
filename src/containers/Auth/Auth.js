import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { connect } from 'react-redux';
import Input from '../../components/UI/Input/Input';
import Button from '../../components/UI/Button/Button';
import IconHeading from '../../components/UI/IconHeading/IconHeading';
import styles from './Auth.module.css';
import * as actions from '../../store/actions';
import Spinner from '../../components/UI/Spinner/Spinner';
import Card from '../../components/UI/Card/Card';
import {
    updateObject,
    checkValidity,
    variantsProps,
    containerVariants,
    scaleVariants
}
    from '../../shared/utility';
import icons from '../../shared/icons';


const initialSignInData = {
    email: {
        elementType: 'input',
        elementLabel: 'Email',
        elementPrefix: 'Envelope',
        elementConfig: {
            id: 'emailInput',
            type: 'email',
        },
        value: '',
        validation: {
            required: true,
            isEmail: true,
            errorMessage: 'Invalid email format.'
        },
        valid: false,
        touched: false
    },
    password: {
        elementType: 'input',
        elementLabel: 'Password',
        elementPrefix: 'Key',
        elementConfig: {
            id: 'passwordInput',
            type: 'password'
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
        elementPrefix: 'User',
        elementConfig: {
            id: 'fullNameInput',
            type: 'text',
        },
        value: '',
        validation: {
            required: true,
            errorMessage: 'This field can\'t be empty.'
        },
        valid: false,
        touched: false
    },
    address: {
        elementType: 'input',
        elementLabel: 'Address',
        elementPrefix: 'Home',
        elementConfig: {
            id: 'addressInput',
            type: 'text',
        },
        value: '',
        validation: {
            required: true,
            errorMessage: 'This field can\'t be empty.'
        },
        valid: false,
        touched: false
    },
    phoneNumber: {
        elementType: 'input',
        elementLabel: 'Phone number',
        elementPrefix: 'PhoneAlt',
        elementConfig: {
            id: 'phoneNumberInput',
            type: 'text',
        },
        value: '',
        validation: {
            required: true,
            isNumeric: true,
            minLength: 9,
            maxLength: 9,
            errorMessage: 'Phone number must consist of 9 digits.'
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

    useEffect(() => {
        if (isAuthed) {
            const { prevPath } = history.location.state || { prevPath: '/' };
            history.replace(prevPath);
        }
    }, [isAuthed, history])

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
        });
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
        <div>
            <form onSubmit={submitHandler}>
                {formElementsArray}
                <Button disabled={!isFormValid} dark>
                    {isSignedUp ? 'Sign In' : 'Sign Up'}
                </Button>
            </form>
            <Button
                secondary
                noMarginTop
                clicked={switchAuthModeHandler}
            >
                {isSignedUp ? 'Switch to sign up panel' : 'Switch to sign in panel'}
            </Button>
        </div>
    )
    if (loading) form = <Spinner withWrapper />
    let errorMessage = null;
    if (error) errorMessage = (
        <p className={styles.errorMessage}>{error}</p>
    )
    let pageContent;
    if (!isAuthed) pageContent = (
        <motion.div
            variants={scaleVariants}
        >
            <Card
                centered
                destination='form'
                solePageElement
            >
                <IconHeading
                    icon={icons[`fa${isSignedUp ? 'SignInAlt' : 'UserPlus'}`]}
                />
                {errorMessage}
                {form}
            </Card>
        </motion.div>
    )

    return (
        <motion.div
            variants={containerVariants}
            {...variantsProps}
        >
            {pageContent}
        </motion.div>
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