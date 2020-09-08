import React, { useState } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { firestoreConnect } from 'react-redux-firebase';
import * as actions from '../../store/actions';
import BurgerCard from '../../components/BurgerCard/BurgerCard';
import Button from '../../components/UI/Button/Button';
import SlimButton from '../../components/UI/SlimButton/SlimButton';
import Modal from '../../components/UI/Modal/Modal';
import Spinner from '../../components/UI/Spinner/Spinner';
import styles from './Cart.module.css';

const Cart = ({
    onAddItem,
    onRemoveItem,
    onClearCart,
    cartUpdateError,
    cartUpdateLoading,
    cartFetchError,
    cartFetchRequested,
    cartBurgersFetchError,
    cartBurgersFetchRequested,
    cartBurgers,
    cart,
    history,
}) => {
    const [isModalShowed, setIsModalShowed] = useState(false);

    const increaseBurgerAmount = (name, ingredients) => {
        setIsModalShowed(true);
        onAddItem({ name, ingredients });
    }
    const decreaseBurgerAmount = (id) => {
        setIsModalShowed(true);
        onRemoveItem(id);
    }

    if (!cartFetchRequested || !cartBurgersFetchRequested) return (
        <div
            style={{
                margin: '100px 0',
                display: 'flex',
                justifyContent: 'center'
            }}
        >
            <Spinner />
        </div>
    )
    if (cartFetchError || cartBurgersFetchError) return (
        <div className={styles.cart}>
            <h2>Cart</h2>
            <div className={styles.cartItems}>
                <p>Unfortunately an error occured while trying to load your cart. Sorry for the inconvenience. Try again later.</p>
            </div>
        </div>
    )
    if (!cartBurgers.length) return (
        <div className={styles.cart}>
            <h2>Cart</h2>
            <div className={styles.cartItems}>
                <p>Your cart is empty.</p>
            </div>
        </div>
    )
    const updateCartProgress = (
        <div>
            {/* modal heading */}
            {cartUpdateLoading && <h2 className='primary'>Updating cart...</h2>}
            {cartUpdateError && <h2 className='danger'>Something went wrong!</h2>}
            {(!cartUpdateError && !cartUpdateLoading) && <h2 className='success'>Success!</h2>}
            {/* modal main content */}
            {cartUpdateLoading && <div
                style={{
                    margin: '100px 0',
                    display: 'flex',
                    justifyContent: 'center'
                }}
            >
                <Spinner />
            </div>}
            {cartUpdateError && <p>Unfortunately, an error occured, while trying to update your cart.</p>}
            {(!cartUpdateError && !cartUpdateLoading) && <p>Your cart has been successfully updated.</p>}
            {/* modal footer with action buttons */}
            {cartUpdateError && (
                <SlimButton
                    btnType='danger'
                    clicked={() => setIsModalShowed(false)}
                >
                    Ok
                </SlimButton>
            )}
            {(!cartUpdateError && !cartUpdateLoading) && <SlimButton
                btnType='success'
                clicked={() => setIsModalShowed(false)}
            >
                Ok
            </SlimButton>}
        </div>
    )
    const cartItems = cartBurgers.map(burger => (
        <BurgerCard
            key={burger.id}
            forTheCart
            amountIncreased={increaseBurgerAmount}
            amountDecreased={decreaseBurgerAmount}
            burgerInfo={burger}
        />
    ))
    return (
        <>
            <Modal
                show={isModalShowed}
                modalClosed={() => setIsModalShowed(false)}
            >
                {isModalShowed && updateCartProgress}
            </Modal>
            <div className={styles.cart}>
                <h2>Cart</h2>
                <div className={styles.cartItems}>
                    {cartItems}
                </div>
                <p className={styles.totalPrice}>
                    Total price: <span>
                        <strong>
                            {cart[0].totalPrice.toFixed(2)}
                        </strong>
                    </span>
                </p>
                <Button
                    lg
                    clicked={() => history.push('/checkout')}
                >
                    Next
                </Button>
            </div>
        </>
    )
}

const mapStateToProps = ({
    cart: { error, loading },
    firebase: {
        auth: {
            uid
        }
    },
    firestore: {
        ordered,
        status,
        errors
    }
}) => ({
    cartUpdateError: error,
    cartUpdateLoading: loading,
    cartFetchError: errors.allIds.includes('cart'),
    cartFetchRequested: status.requested.cart,
    cartBurgersFetchError: errors.allIds.includes('cartBurgers'),
    cartBurgersFetchRequested: status.requested.cartBurgers,
    isAuthed: !!uid,
    cartId: uid,
    cartBurgers: ordered.cartBurgers,
    cart: ordered.cart
})

const mapDispatchToProps = dispatch => ({
    onAddItem: item => dispatch(actions.addItem(item)),
    onRemoveItem: itemId => dispatch(actions.removeItem(itemId)),
    onClearCart: () => dispatch(actions.clearCart())
})
export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    firestoreConnect(props => [
        {
            collection: 'carts',
            doc: props.cartId,
            subcollections: [{
                collection: 'cartBurgers',
                where: [['userId', '==', `${props.cartId}`]]
            }],
            storeAs: 'cartBurgers'
        },
        {
            collection: 'carts',
            doc: props.cartId,
            storeAs: 'cart'
        }
    ]))(Cart);