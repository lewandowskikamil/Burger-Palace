import React from 'react';
import SlimButton from '../../UI/SlimButton/SlimButton'

const OrderSummary = ({ ingredients, canceled, continued, price }) => {
    const ingredientSummary = Object.keys(ingredients)
        .map(igKey => (
            <li key={igKey}>
                <span style={{ textTransform: 'capitalize' }}>{igKey}</span>: {ingredients[igKey]}
            </li>
        ))
    return (
        <>
            <h3>Your order</h3>
            <p>A delicious burger with the following ingredients:</p>
            <ul>
                {ingredientSummary}
            </ul>
            <p><strong>Total price: {price.toFixed(2)}</strong></p>
            <p>Continue to checkout?</p>
            <SlimButton
                btnType='danger'
                clicked={canceled}
            >
                Cancel
            </SlimButton>
            <SlimButton
                btnType='success'
                clicked={continued}
            >
                Continue
            </SlimButton>
        </>
    );
}

export default OrderSummary;