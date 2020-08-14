import React from 'react';
import styles from './Burger.module.css';
import BurgerIngredient from './BurgerIngredient/BurgerIngredient';

const Burger = ({ ingredients }) => {
    // names of the ingredients keys have to match class names from BurgerIngredient.module.css to work properly
    // create an array containing keys of the ingredients object
    // Array(x) - create an array with length equal to x
    let transformedIngredients = Object.keys(ingredients)
        .map(igKey => (
            [...Array(ingredients[igKey])].map((_, i) => (
                <BurgerIngredient key={igKey + i} type={igKey} />
            ))
        ))
        .reduce((arr, el) => {
            return arr.concat(el)
        }, [])
        if(!transformedIngredients.length){
            transformedIngredients=<p className={styles.hint}>Add some ingredients bro!</p>
        }
    return (
        <div className={styles.burger}>
            <BurgerIngredient type="breadTop" />
            {transformedIngredients}
            <BurgerIngredient type="breadBottom" />
        </div>
    );
}

export default Burger;