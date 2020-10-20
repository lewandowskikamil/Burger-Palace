import React, { useRef, useEffect, useState } from 'react';
import styles from './Burger.module.css';
import BurgerIngredient from './BurgerIngredient/BurgerIngredient';

const Burger = ({ ingredients, justifyMode }) => {
    const burgerRef = useRef(null);
    const [justify, setJustify] = useState(justifyMode);

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
    useEffect(() => {
        const ingredientNodes = burgerRef.current.querySelectorAll('div');
        const { height: containerHeight } = burgerRef.current.getBoundingClientRect();
        const ingredientsTotalHeight = [...ingredientNodes].reduce((acc, node) => (
            acc + node.getBoundingClientRect().height
        ), 0);
        if (ingredientsTotalHeight > containerHeight && justify !== 'flex-start') {
            setJustify('flex-start');
        } else if (ingredientsTotalHeight <= containerHeight && justify !== justifyMode) {
            setJustify(justifyMode);
        }
    }, [ingredients, justify, justifyMode])
    return (
        <div
            className={styles.burger}
            ref={burgerRef}
            style={{
                justifyContent: justify
            }}
        >
            <BurgerIngredient type="breadTop" />
            {displayedIngredients}
            <BurgerIngredient type="breadBottom" />
        </div>
    );
}

export default Burger;