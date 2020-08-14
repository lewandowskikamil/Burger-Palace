import React from 'react';
import SlimButton from '../UI/SlimButton/SlimButton';
import styles from './AddingConfirmation.module.css';

const AddingConfirmation = ({ burgerDetails: { name, ingredients, price }, modalDismissed, pageRedirected }) => {
    const displayedIngredients = Object.keys(ingredients).map(ingrKey => (
        <li key={ingrKey}>{ingrKey} ({ingredients[ingrKey]})</li>
    ))
    return (
        <div className={styles.addingConfirmation}>
            <h2>Success!</h2>
            <p>You've just added following burger to the cart:</p>
            <p>Name: <span><strong>{name}</strong></span></p>
            <p>Ingredients:</p>
            <ul>
                {displayedIngredients}
            </ul>
            <p>Price: <span><strong>{Number(price).toFixed(2)}</strong></span></p>
            <div className={styles.btns}>
            <SlimButton
                btnType='success'
                clicked={pageRedirected}
            >
                Go to cart
            </SlimButton>
            <SlimButton
                btnType='neutral'
                clicked={modalDismissed}
            >
                Add more burgers
            </SlimButton>
            </div>
        </div>
    );
}

export default AddingConfirmation;