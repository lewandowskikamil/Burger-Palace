import React from 'react';
import styles from './BurgerIngredient.module.css';
import PropTypes from 'prop-types';

const BurgerIngredient = ({ type }) => {
    const ingredients = ['breadBottom', 'breadTop', 'meat', 'cheese', 'salad', 'bacon'];
    let ingredient = null;
    if (ingredients.includes(type) && type === 'breadTop') {
        ingredient = (
            <div className={styles.breadTop}>
                <span className={styles.seeds1}></span>
                <span className={styles.seeds2}></span>
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