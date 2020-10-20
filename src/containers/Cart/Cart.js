import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { firestoreConnect } from 'react-redux-firebase';
import * as actions from '../../store/actions';
import BurgerCard from '../../components/BurgerCard/BurgerCard';
import Button from '../../components/UI/Button/Button';
import PageHeading from '../../components/UI/PageHeading/PageHeading';
import Modal from '../../components/UI/Modal/Modal';
import AsyncProgress from '../../components/UI/Modal/AsyncProgress/AsyncProgress';
import Spinner from '../../components/UI/Spinner/Spinner';
import styles from './Cart.module.css';
import {
    variantsProps,
    containerVariants,
    fadeVariants,
    translateXVariants,
    translateYVariants,
    scaleXVariants
} from '../../shared/utility';

const Cart = ({
    onAddItem,
    onRemoveItem,
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

    const isOneRow = window.matchMedia('(max-width: 755px)');

    const pageHeading = (
        <motion.div
            variants={translateYVariants}
            custom={true}
        >
            <PageHeading>Cart</PageHeading>
        </motion.div>
    );
    let pageContent;
    if (!cartFetchRequested || !cartBurgersFetchRequested) pageContent = (
        <motion.div
            key='spinner'
            variants={fadeVariants}
            {...variantsProps}
        >
            <Spinner withFullPageWrapper large />
        </motion.div>
    )
    else if (cartFetchError || cartBurgersFetchError) pageContent = (
        <motion.div
            key='contentFail'
            className={styles.cart}
            variants={fadeVariants}
            {...variantsProps}
        >
            {pageHeading}

            <motion.p
                className='info'
                variants={scaleXVariants}
            >
                Unfortunately an error occured while trying to load your cart. Sorry for the inconvenience. Try again later.
            </motion.p>
        </motion.div>
    )
    else if (!cartBurgers.length) pageContent = (
        <motion.div
            key='contentEmpty'
            className={styles.cart}
            variants={fadeVariants}
            {...variantsProps}

        >
            {pageHeading}
            <motion.p
                className='info'
                variants={scaleXVariants}
            >
                Your cart is empty.
            </motion.p>
        </motion.div>
    )
    else pageContent = (
        <motion.div
            key='contentSuccess'
            className={styles.cart}
            variants={fadeVariants}
            {...variantsProps}
        >
            {pageHeading}
            <div className={styles.cartItems}>
                {cartBurgers.map((burger, index) => (
                    <motion.div
                        key={burger.id}
                        variants={translateXVariants}
                        custom={((index + 1) % 2) && isOneRow.matches}
                    >
                        <BurgerCard
                            forTheCart
                            increaseAmount={increaseBurgerAmount}
                            decreaseAmount={decreaseBurgerAmount}
                            burgerInfo={burger}
                        />
                    </motion.div>
                ))}
            </div>
            <motion.div
                variants={translateYVariants}
                custom={false}
            >
                <p className={styles.totalPrice}>
                    Total price: <span className='bold'>
                        {cart[0].totalPrice.toFixed(2)}
                    </span>
                </p>
                <Button
                    clicked={() => history.push('/checkout')}
                    gradient
                >
                    Next
                </Button>
            </motion.div>
        </motion.div >
    )
    return (
        <>
            <Modal
                isShowed={isModalShowed}
                closeModal={() => setIsModalShowed(false)}
            >
                <AsyncProgress
                    error={cartUpdateError}
                    loading={cartUpdateLoading}
                    heading={{
                        loading: 'Updating cart...',
                        fail: 'Something went wrong!',
                        success: 'Success!'
                    }}
                    mainContent={{
                        fail: 'Unfortunately, an error occured while trying to update cart.',
                        success: 'Cart has been successfully updated.'
                    }}
                    buttons={{
                        success: [{
                            theme: 'success',
                            content: 'Ok',
                            clickHandler: () => setIsModalShowed(false)
                        }],
                        fail: [{
                            theme: 'danger',
                            content: 'Ok',
                            clickHandler: () => setIsModalShowed(false)
                        }]
                    }}
                />
            </Modal>
            <motion.div
                variants={containerVariants}
                {...variantsProps}
            >
                <AnimatePresence exitBeforeEnter>
                    {pageContent}
                </AnimatePresence>
            </motion.div>
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
    onRemoveItem: itemId => dispatch(actions.removeItem(itemId))
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