import React from 'react';
import Button from '../UI/Button/Button';
import AmountPanel from '../UI/AmountPanel/AmountPanel';
import Card from '../UI/Card/Card';
import Burger from '../Burger/Burger';
import styles from './BurgerCard.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import icons from '../../shared/icons';

const BurgerCard = ({
    burgerInfo: {
        name,
        ingredients,
        description,
        price,
        amount,
        id,
        authorId
    },
    cartBtnClicked,
    removeBtnClicked,
    updateBtnClicked,
    userRole,
    userId,
    forTheCart,
    increaseAmount,
    decreaseAmount,
}) => {


    const ingredientsInfo = [...new Set(ingredients)]
        .sort()
        .map(uniqueIngr => (
            `${uniqueIngr} (${ingredients.filter(ingr => ingr === uniqueIngr).length})`
        ));
    let burgerDescription = <p className={styles.description}>{description}</p>;
    let burgerIngredients = (
        <div className={styles.ingredients}>
            <p>Ingredients:</p>
            <ul>
                {ingredientsInfo.map(ingr => (
                    <li key={ingr}>
                        <FontAwesomeIcon icon={icons.faHamburger} />{ingr}
                    </li>
                ))}
            </ul>
        </div>
    )
    let menuBtns = (
        <div className={styles.menuBtns}>
            {
                userRole &&
                ['admin', 'super admin'].includes(userRole) &&
                <Button
                    clicked={removeBtnClicked}
                    disabled={authorId !== userId && userRole !== 'super admin'}
                    danger
                    circular
                >
                    <FontAwesomeIcon icon={icons.faTrash} />
                </Button>
            }
            <Button
                clicked={cartBtnClicked}
                circular
            >
                <FontAwesomeIcon icon={icons.faCartPlus} />
            </Button>
            {
                userRole &&
                ['admin', 'super admin'].includes(userRole) &&
                <Button
                    clicked={updateBtnClicked}
                    disabled={authorId !== userId && userRole !== 'super admin'}
                    secondary
                    circular
                >
                    <FontAwesomeIcon icon={icons.faPen} />
                </Button>
            }
        </div>
    )
    let amountPanel = null;
    if (forTheCart) {
        burgerDescription = null;
        burgerIngredients = null;
        menuBtns = null
        amountPanel = (
            <AmountPanel
                increaseAmount={() => increaseAmount(name, ingredients)}
                decreaseAmount={() => decreaseAmount(id)}
                amount={amount}
                margin='40px 0 0 0'
            />
        )
    }

    const classes = [styles.burgerCard];
    if (forTheCart) classes.push(styles.cartItem)
    else classes.push(styles.menuItem)

    return (
        <div className={classes.join(' ')}>
            <Card
                destination={forTheCart ? 'cartItem' : 'menuItem'}
            >
                <h2>{name}</h2>
                <div className={styles.burgerWrapper}>
                    <Burger
                        ingredients={ingredients}
                        justifyMode='flex-end'
                    />
                </div>
                {burgerDescription}
                {burgerIngredients}
                {amountPanel}
                <p className={styles.price}>
                    Price: <span className='bold'>
                        {price.toFixed(2)}
                    </span>
                </p>
                {menuBtns}
            </Card>
        </div>
    );
}

export default BurgerCard;