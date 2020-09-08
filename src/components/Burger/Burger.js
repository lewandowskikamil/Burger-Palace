import React from 'react';
import styles from './Burger.module.css';
import BurgerIngredient from './BurgerIngredient/BurgerIngredient';

const Burger = ({ ingredients }) => {
    let displayedIngredients;
    if (ingredients.length) {
        displayedIngredients = ingredients.map((ingredient, index) => (
            <BurgerIngredient key={index} type={ingredient} />
        ))
    }
    else {
        displayedIngredients = (
            <p className={styles.hint}>Add some ingredients bro!</p>
        )
    }
    return (
        <div className={styles.burger}>
            <BurgerIngredient type="breadTop" />
            {displayedIngredients}
            <BurgerIngredient type="breadBottom" />
        </div>
    );
}

export default Burger;