import React from 'react';
import styles from './BuildControls.module.css'
import BuildControl from './BuildControl/BuildControl'

const controls = [
    { label: 'Salad', type: 'salad' },
    { label: 'Bacon', type: 'bacon' },
    { label: 'Cheese', type: 'cheese' },
    { label: 'Meat', type: 'meat' },
]

const BuildControls = ({
    addIngredient,
    removeIngredient,
    disabled,
    price,
    purchasable,
    addToCart,
    prices
}) => {
    return (
        <div className={styles.buildControls}>
            <p>Current price: <strong>{price.toFixed(2)}</strong></p>
            {controls.map(({ label, type }) => (
                <BuildControl
                    key={label}
                    label={label}
                    type={type}
                    addIngredient={addIngredient}
                    removeIngredient={removeIngredient}
                    disabled={disabled[type]}
                    price={prices[type]}
                />
            ))}
            <button
                className={styles.orderButton}
                disabled={!purchasable}
                onClick={addToCart}
            >
                Add to cart
            </button>
        </div>
    );
}

export default BuildControls;