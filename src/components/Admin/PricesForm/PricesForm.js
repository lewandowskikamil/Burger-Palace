import React, { useState, useEffect } from 'react';
import styles from './PricesForm.module.css';
import Button from '../../UI/Button/Button';
import Card from '../../UI/Card/Card';
import IconHeading from '../../UI/IconHeading/IconHeading';
import Input from '../../UI/Input/Input';
import { updateObject, checkValidity } from '../../../shared/utility';
import icons from '../../../shared/icons';

const IngredientsForm = ({
    pricesData,
    onSubmit,
    valueUnit,
    setModalToShow,
    setIsModalShowed
}) => {
    const pricesDataArray = Object.keys(pricesData)
        .filter(key => key !== 'id')
        .sort()
        .map(key => +pricesData[key]);
    const pricesDataString = JSON.stringify(pricesDataArray);
    const initialFormData = { ...pricesData };
    delete initialFormData.id;

    for (const ingredientKey in initialFormData) {
        initialFormData[ingredientKey] = {
            elementType: 'input',
            elementLabel: ingredientKey[0].toUpperCase() + ingredientKey.slice(1),
            elementPrefix: 'Tag',
            elementConfig: {
                id: `${ingredientKey}Input`,
                type: 'number',
            },
            value: initialFormData[ingredientKey],
            valueUnit,
            validation: {
                required: true,
                isRequiredPrice: true,
                errorMessage: 'Price must be greater than 0 with max 2 decimals.'
            },
            valid: true,
            touched: true
        }
    }

    const [formData, setFormData] = useState(initialFormData);
    const [isFormValid, setIsFormValid] = useState(true);
    const [isThereChange, setIsThereChange] = useState(false);

    useEffect(() => {
        const fieldValues = {}
        for (const formElementKey in formData) {
            fieldValues[formElementKey] = +formData[formElementKey].value;
        }
        const fieldValuesArray = Object.keys(fieldValues)
            .sort()
            .map(key => fieldValues[key]);

        const fieldValuesString = JSON.stringify(fieldValuesArray);
        const isChangeMade = fieldValuesString !== pricesDataString;
        if (isChangeMade !== isThereChange) setIsThereChange(isChangeMade);

    }, [pricesDataString, formData, isThereChange])

    const formSubmitHandler = (e) => {
        e.preventDefault();
        const fieldValues = {}
        for (const formElementKey in formData) {
            fieldValues[formElementKey] = +formData[formElementKey].value;
        }

        onSubmit(fieldValues);
        setModalToShow('updatePrices');
        setIsModalShowed(true);
    }

    const inputChangeHandler = (e) => {
        const { [e.target.name]: formElement } = formData;
        const updatedFormElement = updateObject(formElement, {
            value: e.target.value,
            valid: checkValidity(
                e.target.value, formElement.validation
            ),
        })
        const updatedFormData = updateObject(formData, {
            [e.target.name]: updatedFormElement
        })

        const fieldValues = {}
        for (const formElementKey in updatedFormData) {
            fieldValues[formElementKey] = +updatedFormData[formElementKey].value;
        }
        const fieldValuesArray = Object.keys(fieldValues)
            .sort()
            .map(key => fieldValues[key]);

        const fieldValuesString = JSON.stringify(fieldValuesArray);
        const isChangeMade = fieldValuesString !== pricesDataString;
        let isFormValid = true;
        for (const inputIdentifier in updatedFormData) {
            if (!updatedFormData[inputIdentifier].valid && isFormValid) {
                isFormValid = false
            }
        }
        setFormData(updatedFormData);
        setIsFormValid(isFormValid);
        setIsThereChange(isChangeMade);
    }
    const formElementsArray = Object.keys(formData)
        .sort()
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
            {!isThereChange && <p className={styles.updateHint}>
                To update ingredient prices, first make at least one change.
            </p>}
            <Button
                secondary
                disabled={!isFormValid || !isThereChange}>
                Update
            </Button>
        </form>
    )

    return (
        <Card
            destination='form'
        >
            <IconHeading icon={icons.faTags} />
            {form}
        </Card>
    );
}

export default IngredientsForm;