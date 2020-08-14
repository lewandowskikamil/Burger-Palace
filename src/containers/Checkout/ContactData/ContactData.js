import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import SlimButton from '../../../components/UI/SlimButton/SlimButton';
import Spinner from '../../../components/UI/Spinner/Spinner';
import Modal from '../../../components/UI/Modal/Modal';
import AsyncResultInfo from '../../../components/AsyncResultInfo/AsyncResultInfo';
import Input from '../../../components/UI/Input/Input';
import styles from './ContactData.module.css';
import { connect } from 'react-redux';
import * as actions from '../../../store/actions/';
import { updateObject, checkValidity } from '../../../shared/utility';


const initialFormData = {
    name: {
        elementType: 'input',
        elementLabel: 'Name',
        elementConfig: {
            id: 'nameInput',
            type: 'text',
            placeholder: 'Your name'
        },
        value: '',
        validation: {
            required: true,
            errorMessage: 'This field cannot be empty.'
        },
        valid: false,
        touched: false
    },
    street: {
        elementType: 'input',
        elementLabel: 'Street',
        elementConfig: {
            id: 'streetInput',
            type: 'text',
            placeholder: 'Street you live in'
        },
        value: '',
        validation: {
            required: true,
            errorMessage: 'This field cannot be empty.'
        },
        valid: false,
        touched: false
    },
    zipCode: {
        elementType: 'input',
        elementLabel: 'Zip code',
        elementConfig: {
            id: 'zipCodeInput',
            type: 'text',
            placeholder: 'Your zip code'
        },
        value: '',
        validation: {
            required: true,
            minLength: 3,
            maxLength: 5,
            errorMessage: 'Zip code must consist of 3 to 5 characters.'
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
            errorMessage: 'Enter valid phone number - it should consist of 9 digits'
        },
        valid: false,
        touched: false
    },
    deliveryMethod: {
        elementType: 'select',
        elementLabel: 'Delivery method',
        elementConfig: {
            id: 'deliverySelect',
            options: [
                { value: 'fastest', displayValue: 'Fastest' },
                { value: 'cheapest', displayValue: 'Cheapest' },
            ]
        },
        value: 'cheapest',
        validation: {},
        valid: true,
        touched: false
    }
}

const ContactData = ({
    items,
    userId,
    totalPrice,
    onOrderSubmit,
    onSuccessAcceptance,
    onFailureAcceptance,
    loading,
    error
}) => {
    const [formData, setFormData] = useState(initialFormData);
    const [isFormValid, setIsFormValid] = useState(false);

    const orderHandler = (e) => {
        e.preventDefault();
        const fieldValues = {}
        for (const formElementIdentifier in formData) {
            fieldValues[formElementIdentifier] = formData[formElementIdentifier].value;
        }
        const orderData = {
            userId,
            cartItems: items,
            totalPrice,
            orderTimestamp: Date.parse(new Date()),
            deliveryData: fieldValues,
        }
        onOrderSubmit(orderData);
    }

    const inputChangeHandler = (e) => {
        const { [e.target.name]: formElement } = formData;
        const updatedFormElement = updateObject(formElement, {
            value: e.target.value,
            valid: checkValidity(
                e.target.value, formElement.validation
            ),
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

    if (!totalPrice) return <Redirect to='/' />

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
        <form onSubmit={orderHandler}>
            {formElementsArray}
            <SlimButton btnType='success' disabled={!isFormValid}>Order</SlimButton>
        </form>
    )

    if (loading) form = <Spinner />

    return (
        <>
            <Modal
                show={error !== null}
                modalClosed={error ? onFailureAcceptance : onSuccessAcceptance}
            >
                {error !== null && <AsyncResultInfo
                    infoType={error ? 'danger' : 'success'}
                    clicked={error ? onFailureAcceptance : onSuccessAcceptance}
                />}
            </Modal>
            <div className={styles.contactData}>
                <h2>
                    {loading ? 'Your order is being confirmed...' : 'Enter delivery data'}
                </h2>
                {form}
            </div>
        </>
    );
}
const mapStateToProps = ({
    cart: { items, totalPrice },
    order: { loading, error },
    auth: { userId }
}) => ({
    items,
    totalPrice,
    error,
    loading,
    userId
});

const mapDispatchToProps = dispatch => ({
    onOrderSubmit: (orderData) => {
        dispatch(actions.makeOrder(orderData))
    },
    onSuccessAcceptance: () => {
        dispatch(actions.clearCart())
    },
    onFailureAcceptance: () => {
        dispatch(actions.clearOrderError())
    }
})

export default connect(mapStateToProps, mapDispatchToProps)(ContactData);