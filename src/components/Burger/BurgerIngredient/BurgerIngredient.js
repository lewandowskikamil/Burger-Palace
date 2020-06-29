import React from 'react';
import styles from './BurgerIngredient.module.css';
import PropTypes from 'prop-types';

const BurgerIngredient = ({ type }) => {
    const ingredients = ['breadBottom', 'breadTop', 'meat', 'cheese', 'salad', 'bacon'];
    let ingredient = null;
    if (ingredients.includes(type) && type === 'breadTop') {
        ingredient = (
            <div className={styles.breadTop}>
                <div className={styles.seeds1}></div>
                <div className={styles.seeds2}></div>
            </div>
        )
    } else if (ingredients.includes(type)) {
        ingredient = <div className={styles[type]}></div>;
    }
    
    return ingredient;
}
BurgerIngredient.propTypes = {
    type: PropTypes.oneOf(['breadBottom', 'breadTop', 'meat', 'cheese', 'salad', 'bacon']).isRequired
}

export default BurgerIngredient;