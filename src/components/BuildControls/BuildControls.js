import React from 'react';
import styles from './BuildControls.module.css';
import BuildControl from './BuildControl/BuildControl';
import Button from '../UI/Button/Button';

const BuildControls = ({
    addIngredient,
    removeIngredient,
    price,
    purchasable,
    addToCart,
    showAddForm,
    showUpdateForm,
    prices,
    userRole,
    updatedBurger,
    ingredients
}) => {
    
    return (
        <div className={styles.buildControls}>
            <p>Price: <strong>{price.toFixed(2)} PLN</strong></p>
            {Object.keys(prices)
                .filter(key => key !== 'bun' && key !== 'id')
                .map(key => (
                    <BuildControl
                        key={key}
                        label={key[0].toUpperCase() + key.slice(1)}
                        amount={ingredients.length &&
                            ingredients.filter(ingr => ingr === key).length}
                        type={key}
                        addIngredient={addIngredient}
                        removeIngredient={removeIngredient}
                        price={prices[key]}
                    />
                ))}
            <Button
                disabled={!purchasable}
                clicked={addToCart}
            >
                Add to cart
            </Button>

            {
                userRole &&
                ['admin', 'super admin'].includes(userRole) &&
                <Button
                    noMarginTop
                    disabled={!purchasable}
                    clicked={showAddForm}
                >
                    Add to menu
                </Button>
            }
            {
                userRole &&
                ['admin', 'super admin'].includes(userRole) &&
                updatedBurger &&
                <Button
                    noMarginTop
                    disabled={!purchasable}
                    clicked={showUpdateForm}
                >
                    Update
                </Button>
            }
        </div>
    );
}

export default BuildControls;