import React, { Component } from 'react';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary'

const INGREDIENTS_PRICES = {
    salad: 0.5,
    bacon: 0.4,
    cheese: 1.3,
    meat: 0.7,
}

class BurgerBuilder extends Component {
    state = {
        ingredients: {
            salad: 0,
            bacon: 0,
            cheese: 0,
            meat: 0,
        },
        totalPrice: 4,
        purchasable: false,
        purchasing: false
    }
    purchaseHandler = (purchasing) => {
        this.setState({ purchasing })
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
    render() {
        const { ingredients, totalPrice, purchasable } = this.state;
        const disabledInfo = {
            ...ingredients
        }
        for (let key in disabledInfo) {
            disabledInfo[key] = !Boolean(disabledInfo[key])
        }
        return (
            <>
                <Modal
                    show={this.state.purchasing}
                    modalClosed={() => this.purchaseHandler(false)}
                >
                    <OrderSummary
                        ingredients={ingredients}
                        canceled={() => this.purchaseHandler(false)}
                        continued={() => console.log('redirect')}
                        price={totalPrice}
                    />
                </Modal>
                <Burger ingredients={ingredients} />
                <BuildControls
                    ingredientChanged={this.changeIngredientAmount}
                    disabled={disabledInfo}
                    price={totalPrice}
                    purchasable={purchasable}
                    purchased={() => this.purchaseHandler(true)}
                />
            </>
        );
    }
}

export default BurgerBuilder;