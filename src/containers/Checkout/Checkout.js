import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Button from '../../components/UI/Button/Button';
import Modal from '../../components/UI/Modal/Modal';
import AsyncProgress from '../../components/UI/Modal/AsyncProgress/AsyncProgress';
import Input from '../../components/UI/Input/Input';
import Card from '../../components/UI/Card/Card';
import IconHeading from '../../components/UI/IconHeading/IconHeading';
import { connect } from 'react-redux';
import * as actions from '../../store/actions';
import {
    updateObject,
    checkValidity,
    variantsProps,
    containerVariants,
    scaleVariants
} from '../../shared/utility';
import icons from '../../shared/icons';


const initialFormData = {
    fullName: {
        elementType: 'input',
        elementLabel: 'Full name',
        elementPrefix: 'User',
        elementConfig: {
            id: 'fullNameInput',
            type: 'text'
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
            type: 'text'
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
            type: 'text'
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

const Checkout = ({
    onSubmitOrder,
    orderError,
    orderLoading,
    profile,
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
    const closeModal = (orderError, orderLoading) => {
        setIsModalShowed(false);
        if (!orderError && !orderLoading) history.push('/');
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
    const form = (
        <form onSubmit={submitOrder}>
            {formElementsArray}
            <Button secondary disabled={!isFormValid}>Order</Button>
        </form>
    )
    return (
        <>
            <Modal
                isShowed={isModalShowed}
                closeModal={() => closeModal(orderError, orderLoading)}
            >
                <AsyncProgress
                    error={orderError}
                    loading={orderLoading}
                    heading={{
                        loading: 'Processing order...',
                        fail: 'Something went wrong!',
                        success: 'Success!'
                    }}
                    mainContent={{
                        fail: 'Unfortunately, an error occured while trying to process your order.',
                        success: 'Your order has been successfully made.'
                    }}
                    buttons={{
                        success: [{
                            theme: 'success',
                            content: 'Ok',
                            clickHandler: () => closeModal(orderError, orderLoading)
                        }],
                        fail: [{
                            theme: 'danger',
                            content: 'Ok',
                            clickHandler: () => closeModal(orderError, orderLoading)
                        }]
                    }}
                />
            </Modal>
            <motion.div
                variants={containerVariants}
                {...variantsProps}
            >
                <motion.div
                    variants={scaleVariants}
                >
                    <Card
                        centered
                        destination='form'
                        solePageElement
                    >
                        <IconHeading
                            icon={icons.faTruck}
                        />
                        {form}
                    </Card>
                </motion.div>
            </motion.div>
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
    }
}) => ({
    orderError: error,
    orderLoading: loading,
    cartId: uid,
    profile
});

const mapDispatchToProps = dispatch => ({
    onSubmitOrder: deliveryData => {
        dispatch(actions.makeOrder(deliveryData))
    }
})

export default connect(mapStateToProps, mapDispatchToProps)(Checkout);