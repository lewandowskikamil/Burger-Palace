import React, { Component } from 'react';
import axios from '../../axios-orders';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import Spinner from '../../components/UI/Spinner/Spinner';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler'

const INGREDIENTS_PRICES = {
    salad: 0.5,
    bacon: 0.4,
    cheese: 1.3,
    meat: 0.7,
}

class BurgerBuilder extends Component {
    state = {
        ingredients: null,
        totalPrice: 4,
        purchasable: false,
        purchasing: false,
        loading: false,
        error: null
    }
    purchaseHandler = (purchasing) => {
        this.setState({ purchasing })
    }
    purchaseContinueHandler = () => {
        // console.log('continue')
        // .json extension added for the firebase to function correctly
        this.setState({ loading: true })
        const order = {
            ingredients: this.state.ingredients,
            price: this.state.totalPrice,
            customer: {
                name: 'Peter Pan',
                address: {
                    street: 'FakeStreet 1',
                    zipCode: '22222',
                    country: 'Neverland'
                },
                email: 'peterpan@fakemail.com'
            },
            deliveryMethod: 'slowest possible'
            // in production total price should be calculated at server side in order to prevent any manipulation from the client side

        }
        axios.post('/orders.json', order)
            .then(res => {
                this.setState({ purchasing: false, loading: false })
                //for a fraction of a second you can see order summary before modal disappears
            })
            .catch(err => {
                this.setState({ purchasing: false, loading: false })
            })

    }
    updatePurchaseState = (ingredients) => {
        const sum = Object.keys(ingredients)
            .map(igKey => ingredients[igKey])
            .reduce((sum, el) => sum + el, 0)
        this.setState({ purchasable: Boolean(sum) })
    }
    changeIngredientAmount = (type, isAmountIncreased) => {
        const { ingredients, totalPrice } = this.state;
        const ingrAmount = ingredients[type];
        const updatedCount = isAmountIncreased ? ingrAmount + 1 : ingrAmount - 1
        const updatedIngredients = {
            ...ingredients,
            [type]: updatedCount
        }
        const priceDiff = INGREDIENTS_PRICES[type];
        const newTotalPrice = isAmountIncreased ? totalPrice + priceDiff : totalPrice - priceDiff;
        this.setState({
            ingredients: updatedIngredients,
            totalPrice: newTotalPrice
        })
        this.updatePurchaseState(updatedIngredients);
    }
    componentDidMount() {
        axios.get('/ingredients.json')
            .then(res => {
                this.setState({
                    ingredients: res.data
                })
            })
            .catch(err => {
                this.setState({ error: true })
            })
    }
    render() {
        const { ingredients, totalPrice, purchasable, loading, error } = this.state;
        const disabledInfo = {
            ...ingredients
        }
        for (let key in disabledInfo) {
            disabledInfo[key] = !Boolean(disabledInfo[key])
        }
        let orderSummary = null;
        let burger = error ? (
            <p
                style={{
                    padding: '10px',
                    textAlign: 'center'
                }}
            >
                Sorry, at the moment ingredients can't be loaded. Please, try again later.
            </p>
        ) : (
                <div
                    style={{
                        height: '80vh',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                >
                    <Spinner />
                </div>
            )
        if (ingredients) {
            orderSummary = (
                <OrderSummary
                    ingredients={ingredients}
                    canceled={() => this.purchaseHandler(false)}
                    continued={this.purchaseContinueHandler}
                    price={totalPrice}
                />
            )
            burger = (
                <>
                    <Burger ingredients={ingredients} />
                    <BuildControls
                        ingredientChanged={this.changeIngredientAmount}
                        disabled={disabledInfo}
                        price={totalPrice}
                        purchasable={purchasable}
                        purchased={() => this.purchaseHandler(true)}
                    />
                </>
            )
        }
        if (loading) orderSummary = (
            <div
                style={{
                    height: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}
            >
                <Spinner />
            </div>
        )

        return (
            <>
                <Modal
                    show={this.state.purchasing}
                    modalClosed={() => this.purchaseHandler(false)}
                >
                    {orderSummary}
                </Modal>
                {burger}
            </>
        );
    }
}

export default withErrorHandler(BurgerBuilder, axios);