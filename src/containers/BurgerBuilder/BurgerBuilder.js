import React, { Component } from 'react';
import axios from '../../axios-orders';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import Spinner from '../../components/UI/Spinner/Spinner';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler'
import { connect } from 'react-redux';
import * as actions from '../../store/actions';

// const INGREDIENTS_PRICES = {
//     salad: 0.5,
//     bacon: 0.4,
//     cheese: 1.3,
//     meat: 0.7,
// }

class BurgerBuilder extends Component {
    state = {
        purchasing: false
    }
    purchaseHandler = (purchasing) => {
        this.setState({ purchasing })
    }
    purchaseContinueHandler = () => {
        // console.log('continue')
        // .json extension added for the firebase to function correctly

        // const ingredients = Object.keys(this.state.ingredients)
        //     .map(igKey => `${encodeURIComponent(igKey)}=${encodeURIComponent(this.state.ingredients[igKey])}`)
        //     .join('&')
        const { history, onPurchaseInit } = this.props;
        onPurchaseInit();
        history.push('/checkout');

    }
    // updatePurchaseState = (ingredients) => {
    //     const sum = Object.keys(ingredients)
    //         .map(igKey => ingredients[igKey])
    //         .reduce((sum, el) => sum + el, 0)
    //     this.setState({ purchasable: Boolean(sum) })
    // }
    // changeIngredientAmount = (type, isAmountIncreased) => {
    //     const { ingredients, totalPrice } = this.state;
    //     const ingrAmount = ingredients[type];
    //     const updatedCount = isAmountIncreased ? ingrAmount + 1 : ingrAmount - 1
    //     const updatedIngredients = {
    //         ...ingredients,
    //         [type]: updatedCount
    //     }
    //     const priceDiff = INGREDIENTS_PRICES[type];
    //     const newTotalPrice = isAmountIncreased ? totalPrice + priceDiff : totalPrice - priceDiff;
    //     this.setState({
    //         ingredients: updatedIngredients,
    //         totalPrice: newTotalPrice
    //     })
    //     this.updatePurchaseState(updatedIngredients);
    // }
    componentDidMount() {
        this.props.onIngredientsInit()
    }
    render() {
        const { ingredients, totalPrice, purchasable, onIngredientAdded, onIngredientRemoved, error } = this.props;
        const disabledInfo = {
            ...ingredients
        }
        for (const key in disabledInfo) {
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
                        ingredientAdded={onIngredientAdded}
                        ingredientRemoved={onIngredientRemoved}
                        // adjust build controls comp to these two new methods
                        // also adjust checkout since query params are no longer passed
                        disabled={disabledInfo}
                        price={totalPrice}
                        purchasable={purchasable}
                        purchased={() => this.purchaseHandler(true)}
                    />
                </>
            )
        }
        // if (loading) orderSummary = (
        //     <div
        //         style={{
        //             height: '100%',
        //             display: 'flex',
        //             justifyContent: 'center',
        //             alignItems: 'center'
        //         }}
        //     >
        //         <Spinner />
        //     </div>
        // )

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

const mapStateToProps = ({ burger: { ingredients, totalPrice, purchasable, error } }) => ({
    ingredients,
    totalPrice,
    purchasable,
    error
});
const mapDispatchToProps = (dispatch) => ({
    onIngredientAdded: ingredientName => {
        dispatch(actions.addIngredient(ingredientName))
    },
    onIngredientRemoved: ingredientName => {
        dispatch(actions.removeIngredient(ingredientName))
    },
    onIngredientsInit: () => {
        dispatch(actions.initIngredients())
    },
    onPurchaseInit: () => {
        dispatch(actions.purchaseInit())
    },
})

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(BurgerBuilder, axios));