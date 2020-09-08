import React from 'react';
import Button from '../UI/Button/Button';
import Burger from '../Burger/Burger';
import styles from './BurgerCard.module.css';

const BurgerCard = ({
    burgerInfo: {
        name,
        ingredients,
        description,
        price,
        amount,
        id
    },
    btnClicked,
    forTheCart,
    amountIncreased,
    amountDecreased
}) => {

    const ingredientsInfo = []
    if (!forTheCart) {
        for (const ingrKey in ingredients) {
            if (ingredients[ingrKey]) {
                ingredientsInfo.push(`${ingrKey} (${ingredients[ingrKey]})`)
            }
        }
    }
    let burgerDescription = <p className={styles.description}>{description}</p>;
    let burgerIngredients = <p>Ingredients: {ingredientsInfo.join(', ')}</p>;
    let addToCartBtn = (
        <Button
            lg
            clicked={btnClicked}
        >
            Add to cart
        </Button>
    )
    let amountPanel = null;
    if (forTheCart) {
        burgerDescription = null;
        burgerIngredients = null;
        addToCartBtn = null
        amountPanel = (
            <div className={styles.amountPanel}>
                <button onClick={() => amountDecreased(id)}>
                    <span className="fa fa-minus"></span>
                </button>
                <span><strong>{amount}</strong></span>
                <button onClick={() => amountIncreased(name, ingredients)}>
                    <span className="fa fa-plus"></span>
                </button>
            </div>
        );
    }

    const classes = [styles.burgerCard];
    if (forTheCart) classes.push(styles.cartItem)
    else classes.push(styles.menuItem)

    return (
        <div className={classes.join(' ')}>
            <h4>{name}</h4>
            <div className={styles.burgerWrapper}>
                <Burger ingredients={ingredients}></Burger>
            </div>
            {burgerDescription}
            {burgerIngredients}
            {amountPanel}
            <p className={styles.price}>Price: <span><strong>{price.toFixed(2)}</strong></span></p>
            {addToCartBtn}
        </div>
    );
}

export default BurgerCard;