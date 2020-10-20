import React, { useState } from 'react';
import styles from './UpdateMenuForm.module.css';
import Button from '../../Button/Button';
import Input from '../../Input/Input';
import { updateObject, checkValidity } from '../../../../shared/utility';

const UpdateMenuForm = ({
    id = '',
    name = '',
    description = '',
    onFormSubmit,
    ingredients
}) => {
    const initialFormData = {
        name: {
            elementType: 'input',
            elementLabel: 'Name',
            elementConfig: {
                id: 'nameInput',
                type: 'text'
            },
            value: name,
            validation: {
                required: true,
                errorMessage: 'This field can\'t be empty.'
            },
            valid: !!name.trim(),
            touched: !!name
        },
        description: {
            elementType: 'input',
            elementLabel: 'Description',
            elementConfig: {
                id: 'descriptionInput',
                type: 'text'
            },
            value: description,
            validation: {
                required: true,
                errorMessage: 'This field can\'t be empty.'
            },
            valid: !!description.trim(),
            touched: !!description
        },
    }
    const [formData, setFormData] = useState(initialFormData);
    const [isFormValid, setIsFormValid] = useState(
        !!name.trim() && !!description.trim()
    );

    const formSubmitHandler = (e) => {
        e.preventDefault();
        const fieldValues = {}
        for (const formElementKey in formData) {
            fieldValues[formElementKey] = formData[formElementKey].value.trim();
        }

        onFormSubmit({ ...fieldValues, ingredients, id });
    }
    const inputChangeHandler = (e) => {
        const { [e.target.name]: formElement } = formData;
        const updatedFormElement = updateObject(formElement, {
            value: e.target.value,
            valid: checkValidity(
                e.target.value, formElement.validation
            ),
            touched: true
        })
        const updatedFormData = updateObject(formData, {
            [e.target.name]: updatedFormElement
        })
        let isFormValid = true;
        for (const formElementKey in updatedFormData) {
            isFormValid = isFormValid &&
                updatedFormData[formElementKey].valid
        }
        setFormData(updatedFormData);
        setIsFormValid(isFormValid);
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
        <form onSubmit={formSubmitHandler}>
            {formElementsArray}
            <Button
                dark
                disabled={!isFormValid}
            >
                {name ? 'Update burger' : 'Add burger'}
            </Button>
        </form>
    )
    return (
        <div className={styles.updateMenuForm}>
            <h2 className='dark'>Burger details</h2>
            {form}
        </div>
    );
}

export default UpdateMenuForm;