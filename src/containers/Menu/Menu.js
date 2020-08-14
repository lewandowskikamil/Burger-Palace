import React, { useState } from 'react';
import Button from '../../components/UI/Button/Button';
import BurgerCard from '../../components/BurgerCard/BurgerCard';
import AddingConfirmation from '../../components/AddingConfirmation/AddingConfirmation';
import Modal from '../../components/UI/Modal/Modal';
import styles from './Menu.module.css';
import { INGREDIENTS_PRICES } from '../../store/reducers/burgerBuilder';
import { connect } from 'react-redux';
import * as actions from '../../store/actions';

const burgers = [
    {
        name: 'Classic',
        ingredients: {
            bacon: 1,
            cheese: 1,
            meat: 1,
            salad: 1
        },
        description: 'Don\'t like to experiment much? This one is for you.',
        price: 4
    },
    {
        name: 'Meat Beast',
        ingredients: {
            bacon: 3,
            cheese: 0,
            meat: 3,
            salad: 0
        },
        description: 'Tame it if you can.',
        price: 4
    },
    {
        name: 'Veggie Soldier',
        ingredients: {
            bacon: 0,
            cheese: 2,
            meat: 0,
            salad: 2
        },
        description: 'On duty whenever you don\'t feel like eating meat.',
        price: 4
    },
    {
        name: 'Biggie',
        ingredients: {
            bacon: 2,
            cheese: 2,
            meat: 2,
            salad: 2
        },
        description: 'Remedy for all suicidal thoughts.',
        price: 4
    }
]
const burgersWithPrices = burgers.map(burger => {
    for (const ingrKey in burger.ingredients) {
        burger.price += INGREDIENTS_PRICES[ingrKey] * burger.ingredients[ingrKey]
    }
    return burger
})

const Menu = ({ onAddToCart, history }) => {
    const [isModalShowed, setIsModalShowed] = useState(false);
    const [lastAddedBurger, setLastAddedBurger] = useState(null);
    const addToCartHandler = ({ name, ingredients, price }) => {
        const item = {
            id: Date.parse(new Date()),
            name,
            ingredients,
            price,
            amount: 1
        }
        onAddToCart(item);
        setLastAddedBurger(item)
        setIsModalShowed(true)
    }
    const menuItems = burgersWithPrices.map(burger => (
        <BurgerCard
            key={burger.name}
            burgerInfo={burger}
            btnClicked={() => addToCartHandler(burger)}
        />
    ))
    return (
        <>
            <Modal
                show={isModalShowed}
                modalClosed={() => setIsModalShowed(false)}
            >
                {lastAddedBurger && <AddingConfirmation
                    burgerDetails={lastAddedBurger}
                    modalDismissed={() => setIsModalShowed(false)}
                    pageRedirected={() => history.push('/cart')}
                />}
            </Modal>
            <div className={styles.menu}>
                <h2>Menu</h2>
                <div>
                    {menuItems}
                </div>
                <h3>Couldn't find a burger matching your needs?</h3>
                <Button
                    clicked={() => history.push('/')}
                    lg
                >
                    Build custom burger
                </Button>
            </div>
        </>
    );
}

const mapDispatchToProps = dispatch => ({
    onAddToCart: item => dispatch(actions.addCartItem(item))
})

export default connect(null, mapDispatchToProps)(Menu);