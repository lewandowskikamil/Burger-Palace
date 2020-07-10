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

export class BurgerBuilder extends Component {
    state = {
        purchasing: false
    }
    purchaseHandler = (purchasing) => {
        const { isAuthed, history, onSetAuthRedirectPath } = this.props;
        if (isAuthed) this.setState({ purchasing });
        else {
            onSetAuthRedirectPath('/checkout');
            history.push('/auth');
        }
    }
    purchaseContinueHandler = () => {
        const { history, onPurchaseInit } = this.props;
        onPurchaseInit();
        history.push('/checkout');

    }
    componentDidMount() {
        this.props.onIngredientsInit()
    }
    render() {
        const { ingredients, totalPrice, purchasable, onIngredientAdded, onIngredientRemoved, error, isAuthed } = this.props;
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
                        disabled={disabledInfo}
                        price={totalPrice}
                        purchasable={purchasable}
                        purchased={() => this.purchaseHandler(true)}
                        isAuthed={isAuthed}
                    />
                </>
            )
        }

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

const mapStateToProps = ({ burger: { ingredients, totalPrice, purchasable, error }, auth: { token } }) => ({
    ingredients,
    totalPrice,
    purchasable,
    error,
    isAuthed: !!token
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
    onSetAuthRedirectPath: (path) => {
        dispatch(actions.setAuthRedirectPath(path))
    }
})

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(BurgerBuilder, axios));