import React, { useState } from 'react';
import { updateObject, checkValidity } from '../../../shared/utility';
import SlimButton from '../../../components/UI/SlimButton/SlimButton';
import Input from '../../../components/UI/Input/Input';
// import withErrorHandler from '../../../hoc/withErrorHandler/withErrorHandler';
import styles from './OrderFilters.module.css';


const initialFormData = {
    startDate: {
        elementType: 'input',
        elementLabel: 'Start date',
        elementConfig: {
            id: 'startDateInput',
            type: 'date'
        },
        value: '',
        validation: {
            required: false,
            errorMessage: ''
        },
        valid: true,
        touched: false
    },
    endDate: {
        elementType: 'input',
        elementLabel: 'End date',
        elementConfig: {
            id: 'endDateInput',
            type: 'date'
        },
        value: '',
        validation: {
            required: false,
            errorMessage: ''
        },
        valid: true,
        touched: false
    },
    startPrice: {
        elementType: 'input',
        elementLabel: 'Start price',
        elementConfig: {
            id: 'startPriceInput',
            type: 'number',
            placeholder: 'Cheaper orders won\'t be shown'
        },
        value: '',
        validation: {
            required: false,
            errorMessage: 'Price must be greater than 4.00',
            isOptionalPrice: true
        },
        valid: true,
        touched: false
    },
    endPrice: {
        elementType: 'input',
        elementLabel: 'End price',
        elementConfig: {
            id: 'endPriceInput',
            type: 'number',
            placeholder: 'More expensive orders won\'t be shown'
        },
        value: '',
        validation: {
            required: false,
            errorMessage: 'Price must be greater than 4.00',
            isOptionalPrice: true
        },
        valid: true,
        touched: false
    },
}
const OrderFilters = ({ onFilterOrders }) => {
    const [formData, setFormData] = useState(initialFormData);
    const [isFormValid, setIsFormValid] = useState(false);

    const filtersSubmitHandler = (e) => {
        e.preventDefault();
        const filters = {};
        for (const filterIdentifier in formData) {
            filters[filterIdentifier] = formData[filterIdentifier].value;
        }
        onFilterOrders(filters)
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
        if (isFormValid === updatedFormElement.valid && updatedFormElement.value !== '') {
            setFormData(updatedFormData);
        } else {
            let isFormValid = true;
            let value = '';
            for (const inputIdentifier in updatedFormData) {
                if (!updatedFormData[inputIdentifier].valid && isFormValid) {
                    isFormValid = false
                }
                value += updatedFormData[inputIdentifier].value;
            }
            if (value === '') isFormValid = false;
            setFormData(updatedFormData);
            setIsFormValid(isFormValid);
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
        <form onSubmit={filtersSubmitHandler}>
            {formElementsArray}
            <SlimButton btnType='success' disabled={!isFormValid}>Filter</SlimButton>
        </form>
    )
    return (
        <div className={styles.orderFilters}>
            <h2>Enter filter data</h2>
            {form}
        </div>
    );
}

export default OrderFilters;