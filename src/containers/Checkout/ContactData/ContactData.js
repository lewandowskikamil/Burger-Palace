import React, { Component } from 'react';
import Button from '../../../components/UI/Button/Button';
import Spinner from '../../../components/UI/Spinner/Spinner';
import Input from '../../../components/UI/Input/Input';
import styles from './ContactData.module.css';
import axios from '../../../axios-orders';
import { connect } from 'react-redux';
import withErrorHandler from '../../../hoc/withErrorHandler/withErrorHandler';
import * as actions from '../../../store/actions/';

class ContactData extends Component {
    state = {
        orderForm: {
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
            country: {
                elementType: 'input',
                elementLabel: 'Country',
                elementConfig: {
                    id: 'countryInput',
                    type: 'text',
                    placeholder: 'Country you live in'
                },
                value: '',
                validation: {
                    required: true,
                    errorMessage: 'This field cannot be empty.'
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
                value: 'cheapest'
            },
        },
        isFormValid: false
    }
    orderHandler = (e) => {
        e.preventDefault();
        this.setState({ loading: true })
        const formData = {}
        for (const formElementIdentifier in this.state.orderForm) {
            formData[formElementIdentifier] = this.state.orderForm[formElementIdentifier].value;
        }
        const order = {
            ingredients: this.props.ingredients,
            price: this.props.totalPrice,
            orderData: formData,
            // in production total price should be calculated at server side in order to prevent any manipulation from the client side
        }
        this.props.onOrderSubmit(order);
    }
    inputChangeHandler = (e) => {
        const updatedOrderForm = {
            ...this.state.orderForm
        }
        const updatedFormElement = {
            ...updatedOrderForm[e.target.name]
        }
        updatedFormElement.value = e.target.value
        updatedFormElement.valid = this.checkValidity(e.target.value, updatedFormElement.validation)
        if (!updatedFormElement.touched) updatedFormElement.touched = true
        updatedOrderForm[e.target.name] = updatedFormElement
        let isFormValid = true;
        for (let inputIdentifier in updatedOrderForm) {
            if (updatedOrderForm[inputIdentifier].valid === false && isFormValid) {
                isFormValid = false
            }
        }

        this.setState({ orderForm: updatedOrderForm, isFormValid });
    }
    checkValidity(value, rules) {
        let isValid = true;
        if (!rules) return isValid;
        if (rules.required) {
            isValid = value.trim() !== '';
        }
        if (rules.minLength) {
            isValid = value.trim().length >= rules.minLength && isValid;
        }
        if (rules.maxLength) {
            isValid = value.trim().length <= rules.maxLength && isValid;
        }

        return isValid
    }
    render() {
        const { orderForm, isFormValid } = this.state;
        const formElementsArray = Object.keys(orderForm)
            .map(elKey => ({
                ...orderForm[elKey],
                elementConfig: {
                    ...orderForm[elKey].elementConfig,
                    name: elKey
                }
            }))
            .map(element => (
                <Input
                    key={element.elementConfig.name}
                    changed={this.inputChangeHandler}
                    {...element}
                />
            ))
        let form = (
            <form onSubmit={this.orderHandler}>
                {formElementsArray}
                <Button btnType='success' disabled={!isFormValid}>Order</Button>
            </form>
        )
        if (this.props.loading) form = <Spinner />
        return (
            <div className={styles.contactData}>
                <h2>Enter your contact data</h2>
                {form}
            </div>
        );
    }
}
const mapStateToProps = ({ burger: { ingredients, totalPrice }, order: { loading } }) => ({
    ingredients,
    totalPrice,
    loading
});

const mapDispatchToProps = dispatch => ({
    onOrderSubmit: (orderData) => {
        dispatch(actions.purchaseBurger(orderData))
    }
})

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(ContactData, axios));