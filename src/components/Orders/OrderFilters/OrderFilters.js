import React, { useState, useEffect } from 'react';
import { updateObject, checkValidity } from '../../../shared/utility';
import icons from '../../../shared/icons';
import Button from '../../../components/UI/Button/Button';
import Input from '../../UI/Input/Input';
import Card from '../../UI/Card/Card';
import IconHeading from '../../UI/IconHeading/IconHeading';


const initialFormData = {
    startDate: {
        elementType: 'input',
        elementLabel: 'Start date',
        elementPrefix: 'Calendar',
        elementConfig: {
            id: 'startDateInput',
            type: 'date',
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
        elementPrefix: 'Calendar',
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
        elementPrefix: 'Tag',
        elementConfig: {
            id: 'startPriceInput',
            type: 'number'
        },
        value: '',
        valueUnit: 'PLN',
        validation: {
            required: false,
            errorMessage: 'Price must be greater than 0.',
            isOptionalPrice: true
        },
        valid: true,
        touched: false
    },
    endPrice: {
        elementType: 'input',
        elementLabel: 'End price',
        elementPrefix: 'Tag',
        elementConfig: {
            id: 'endPriceInput',
            type: 'number'
        },
        value: '',
        valueUnit: 'PLN',
        validation: {
            required: false,
            errorMessage: 'Price must be greater than 0 with max 2 decimals.',
            isOptionalPrice: true
        },
        valid: true,
        touched: false
    },
}
const OrderFilters = ({
    savedFilters,
    filterOrders,
    setOrdersFilters,
    orders,
    ordersBurgers,
    userRole,
    userId
}) => {

    let areFieldsValid = true;
    for (const inputIdentifier in initialFormData) {
        initialFormData[inputIdentifier].value = savedFilters[inputIdentifier];
        initialFormData[inputIdentifier].valid = checkValidity(
            savedFilters[inputIdentifier],
            initialFormData[inputIdentifier].validation
        );
        initialFormData[inputIdentifier].touched = !!savedFilters[inputIdentifier];

        areFieldsValid = areFieldsValid && initialFormData[inputIdentifier].valid;
    }
    if (['admin', 'super admin'].includes(userRole)) {
        initialFormData.showAll = {
            elementType: 'input',
            elementLabel: 'Show all users orders',
            elementConfig: {
                id: 'showAllInput',
                type: 'checkbox',
                checked: savedFilters.showAll
            },
            validation: {
                required: false,
            },
            value: 'showAll',
            valid: true,
            touched: false
        }
    }

    const [formData, setFormData] = useState(initialFormData);
    const [isFormValid, setIsFormValid] = useState(areFieldsValid);

    useEffect(() => {
        filterOrders(orders, ordersBurgers, userRole, userId)
    }, [savedFilters, orders, ordersBurgers, filterOrders, userRole, userId]);

    const formSubmitHandler = (e) => {
        e.preventDefault();
        const filters = {};
        for (const filterIdentifier in formData) {
            filters[filterIdentifier] = filterIdentifier === 'showAll' ? (
                formData[filterIdentifier].elementConfig.checked
            ) : formData[filterIdentifier].value;
        }
        setOrdersFilters(filters);
    }
    const inputChangeHandler = (e) => {
        const { [e.target.name]: formElement } = formData;
        let updatedFormElement
        if (e.target.type === 'checkbox') {
            updatedFormElement = updateObject(formElement, {
                elementConfig: updateObject(formElement.elementConfig, {
                    checked: e.target.checked
                })
            })
        }
        else {
            updatedFormElement = updateObject(formElement, {
                value: e.target.value,
                valid: checkValidity(
                    e.target.value,
                    formElement.validation
                ),
            })
        }
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
        <form onSubmit={formSubmitHandler}>
            {formElementsArray}
            <Button
                secondary
                disabled={!isFormValid}
            >
                Filter
            </Button>
        </form>
    )

    return (
        <Card
            destination='form'
        >
            <IconHeading icon={icons.faFilter} />
            {form}
        </Card>
    );
}

export default OrderFilters;