import React, { useState } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../store/actions';
import BurgerCard from '../../components/BurgerCard/BurgerCard';
import Button from '../../components/UI/Button/Button';
import SlimButton from '../../components/UI/SlimButton/SlimButton';
import Modal from '../../components/UI/Modal/Modal';
import styles from './Cart.module.css';

const Cart = ({ items, totalPrice, onItemAdded, onItemRemoved, isAuthed, history, onSignInRedirect }) => {
    const [isModalShowed, setIsModalShowed] = useState(false);
    const leaveCartHandler = (isAuthed) => {
        if (isAuthed) return history.push('/checkout');
        setIsModalShowed(true);
    }
    const goToSignInHandler = () => {
        onSignInRedirect('/checkout');
        history.push('/auth')
    }
    const goToCheckoutHandler = () => {
        history.push('/checkout')
    }

    let cartItems = <p>Your cart is empty.</p>;
    let cartTotalPrice = null;
    let leaveCartInfo = null;
    let leaveCartBtn = null;

    if (items.length) {
        cartItems = items.map(burger => (
            <BurgerCard
                key={burger.id}
                forTheCart
                amountIncreased={onItemAdded}
                amountDecreased={onItemRemoved}
                burgerInfo={burger}
            />
        ))
        cartTotalPrice = (
            <p className={styles.totalPrice}>
                Total price: <span>
                    <strong>
                        {totalPrice.toFixed(2)}
                    </strong>
                </span>
            </p>
        )
        leaveCartInfo = (
            <div className={styles.leaveCartInfo}>
                <h2>
                    You're not signed in!
                </h2>
                <p>
                    Obviously, you can still make an order. Bear in mind, though, that unless you sign in, it won't be visible in Orders section (accessible only for signed in users).
                </p>
                <div className={styles.btns}>
                    <SlimButton
                        btnType='success'
                        clicked={goToSignInHandler}
                    >
                        Sign In
                </SlimButton>
                    <SlimButton
                        btnType='danger'
                        clicked={goToCheckoutHandler}
                    >
                        Continue without signing in
                </SlimButton>
                </div>
            </div>
        )
        leaveCartBtn = (
            <Button
                lg
                clicked={() => leaveCartHandler(isAuthed)}
            >
                Next
            </Button>
        )

    }

    return (
        <>
            <Modal
                show={isModalShowed}
                modalClosed={() => setIsModalShowed(false)}
            >
                {leaveCartInfo}
            </Modal>
            <div className={styles.cart}>
                <h2>Cart</h2>
                <div className={styles.cartItems}>
                    {cartItems}
                </div>
                {cartTotalPrice}
                {leaveCartBtn}
            </div>
        </>
    );
}

const mapStateToProps = ({
    cart: { items, totalPrice },
    auth: { token }
}) => ({
    items,
    totalPrice,
    isAuthed: !!token
})

const mapDispatchToProps = dispatch => ({
    onItemAdded: item => dispatch(actions.addCartItem(item)),
    onItemRemoved: item => dispatch(actions.removeCartItem(item)),
    onSignInRedirect:path=>dispatch(actions.setAuthRedirectPath(path))
})

export default connect(mapStateToProps, mapDispatchToProps)(Cart);