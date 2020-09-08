import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import SlimButton from '../../components/UI/SlimButton/SlimButton';
import Spinner from '../../components/UI/Spinner/Spinner';
import Modal from '../../components/UI/Modal/Modal';
import Input from '../../components/UI/Input/Input';
import styles from './Checkout.module.css';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { firestoreConnect } from 'react-redux-firebase';
import * as actions from '../../store/actions';
import { updateObject, checkValidity } from '../../shared/utility';


const initialFormData = {
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

const Checkout = ({
    onSubmitOrder,
    orderError,
    orderLoading,
    profile,
    cartBurgers,
    cartBurgersRequested,
    cartBurgersError,
    history
}) => {
    for (const inputIdentifier in initialFormData) {
        initialFormData[inputIdentifier].value = profile[inputIdentifier];
        initialFormData[inputIdentifier].valid = true;
        initialFormData[inputIdentifier].touched = true;
    }
    const [formData, setFormData] = useState(initialFormData);
    const [isFormValid, setIsFormValid] = useState(true);
    const [isModalShowed, setIsModalShowed] = useState(false);


    const submitOrder = (e) => {
        e.preventDefault();
        const fieldValues = {}
        for (const formElementIdentifier in formData) {
            fieldValues[formElementIdentifier] = formData[formElementIdentifier].value;
        }
        setIsModalShowed(true);
        onSubmitOrder(fieldValues);
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
    const dismissModal = (orderError, orderLoading) => {
        setIsModalShowed(false);
        if (!orderError && !orderLoading) history.push('/');
    }

    if (!cartBurgersRequested) return (
        <div
            style={{
                margin: '100px 0',
                display: 'flex',
                justifyContent: 'center'
            }}
        >
            <Spinner />
        </div>
    )
    if (cartBurgersError || !cartBurgers.length) return <Redirect to='/' />

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
    const form = (
        <form onSubmit={submitOrder}>
            {formElementsArray}
            <SlimButton btnType='success' disabled={!isFormValid}>Order</SlimButton>
        </form>
    )
    const makeOrderProgress = (
        <div>
            {/* modal heading */}
            {orderLoading && <h2 className='primary'>Processing order...</h2>}
            {orderError && <h2 className='danger'>Something went wrong!</h2>}
            {(!orderError && !orderLoading) && <h2 className='success'>Success!</h2>}
            {/* modal main content */}
            {orderLoading && <div
                style={{
                    margin: '100px 0',
                    display: 'flex',
                    justifyContent: 'center'
                }}
            >
                <Spinner />
            </div>}
            {orderError && <p>Unfortunately, an error occured, while trying to process your order.</p>}
            {(!orderError && !orderLoading) && <p>Your order has been successfully made.</p>}
            {/* modal footer with action buttons */}
            {orderError && (
                <SlimButton
                    btnType='danger'
                    clicked={() => dismissModal(orderError, orderLoading)}
                >
                    Ok
                </SlimButton>
            )}
            {(!orderError && !orderLoading) && <SlimButton
                btnType='success'
                clicked={() => dismissModal(orderError, orderLoading)}
            >
                Ok
            </SlimButton>}
        </div>
    )
    return (
        <>
            <Modal
                show={isModalShowed}
                modalClosed={() => dismissModal(orderError, orderLoading)}
            >
                {makeOrderProgress}
            </Modal>
            <div className={styles.contactData}>
                <h2>Enter delivery data</h2>
                {form}
            </div>
        </>
    );
}
const mapStateToProps = ({
    order: { loading, error },
    firebase: {
        profile,
        auth: {
            uid
        }
    },
    firestore: {
        ordered,
        status,
        errors
    }
}) => ({
    orderError: error,
    orderLoading: loading,
    cartId: uid,
    profile,
    cartBurgers: ordered.cartBurgers,
    cartBurgersRequested: status.requested.cartBurgers,
    cartBurgersError: errors.allIds.includes('cartBurgers')
});

const mapDispatchToProps = dispatch => ({
    onSubmitOrder: deliveryData => {
        dispatch(actions.makeOrder(deliveryData))
    }
})

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    firestoreConnect(props => [
        {
            collection: 'carts',
            doc: props.cartId,
            subcollections: [{
                collection: 'cartBurgers',
                where: [['userId', '==', `${props.cartId}`]]
            }],
            storeAs: 'cartBurgers'
        },
    ]))(Checkout);