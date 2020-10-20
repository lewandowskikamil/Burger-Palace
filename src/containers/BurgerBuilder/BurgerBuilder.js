import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import AsyncProgress from '../../components/UI/Modal/AsyncProgress/AsyncProgress';
import AuthMissing from '../../components/UI/Modal/AuthMissing/AuthMissing';
import UpdateMenuForm from '../../components/UI/Modal/UpdateMenuForm/UpdateMenuForm';
import Spinner from '../../components/UI/Spinner/Spinner';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { firestoreConnect } from 'react-redux-firebase';
import * as actions from '../../store/actions';
import styles from './BurgerBuilder.module.css';
import {
    variantsProps,
    containerVariants,
    translateYVariants,
    fadeVariants,
    scaleXVariants
} from '../../shared/utility';

const buildControlsVariants = {
    hidden: isFlexDirectionRow => ({
        opacity: 0,
        [isFlexDirectionRow ? 'x' : 'y']: isFlexDirectionRow ? '-100vw' : '100vh'
    }),
    visible: isFlexDirectionRow => ({
        opacity: 1,
        [isFlexDirectionRow ? 'x' : 'y']: 0
    })
}

const BurgerBuilder = ({
    history,
    onAddIngredient,
    onRemoveIngredient,
    onClearIngredients,
    onAddToCart,
    onAddToMenu,
    onUpdateMenuItem,
    onClearBurgerData,
    ingredients,
    totalPrice,
    purchasable,
    cartError,
    cartLoading,
    prices,
    pricesRequested,
    pricesError,
    isAuthed,
    userRole,
    adminError,
    adminLoading,
    updatedBurger
}) => {
    const [isModalShowed, setIsModalShowed] = useState(false);
    const [modalToShow, setModalToShow] = useState('');

    const addToCart = (ingredients, isAuthed) => {
        if (isAuthed) {
            setModalToShow('addToCartAuthed');
            onAddToCart({ name: 'Custom burger', ingredients });
        } else setModalToShow('addToCartUnauthed');
        setIsModalShowed(true);
    }
    const redirectToCart = () => {
        setIsModalShowed(false);
        onClearIngredients();
        history.push('/cart');
    }
    const redirectToSignIn = () => {
        const state = {
            prevPath: history.location.pathname
        }
        history.push('/auth', state);
    }
    const getCloseModalFunction = (modalToShow, adminError, cartError) => {
        if ([
            'addMenuItemForm',
            'updateMenuItemForm',
            'addToCartUnauthed'
        ].includes(modalToShow)) {
            return () => setIsModalShowed(false);
        }
        if (modalToShow === 'addToCartAuthed') {
            return () => {
                if (!cartError) onClearIngredients();
                setIsModalShowed(false);
            }
        }
        if (modalToShow === 'addToMenu') {
            return () => {
                if (!adminError) onClearIngredients();
                setIsModalShowed(false);
            }
        }
        if (modalToShow === 'updateMenuItem') {
            return () => {
                if (!adminError) {
                    onClearIngredients();
                    onClearBurgerData();
                }
                setIsModalShowed(false);
            }
        }
    }
    const addToMenu = burgerData => {
        setModalToShow('addToMenu');
        onAddToMenu(burgerData);
    }
    const updateMenuItem = burgerData => {
        setModalToShow('updateMenuItem');
        onUpdateMenuItem(burgerData);
    }
    const showAddForm = () => {
        setModalToShow('addMenuItemForm');
        setIsModalShowed(true);
    }
    const showUpdateForm = () => {
        setModalToShow('updateMenuItemForm');
        setIsModalShowed(true);
    }
    useEffect(() => {
        return () => onClearBurgerData()
    }, [onClearBurgerData])

    const isFlexDirectionRow = window.matchMedia('(min-width: 768px)');

    let pageContent;
    if (!pricesRequested) pageContent = (
        <motion.div
            key='spinner'
            variants={fadeVariants}
            {...variantsProps}
        >
            <Spinner withFullPageWrapper large />
        </motion.div>
    )
    else if (pricesError) pageContent = (
        <motion.div
            key='contentFail'
            variants={fadeVariants}
            {...variantsProps}
        >
            <motion.p
                className='info'
                variants={scaleXVariants}
            >
                Unfortunately, an error occured while trying to fetch ingredient prices from our database. Please, try again later.
            </motion.p>
        </motion.div>
    )
    else pageContent = (
        <motion.div
            key='contentSuccess'
            className={styles.burgerBuilder}
            variants={fadeVariants}
            {...variantsProps}
        >
            <motion.div
                variants={translateYVariants}
                custom={true}
                className={styles.burgerWrapperContainer}
            >
                <div className={styles.burgerWrapper}>
                    <Burger
                        ingredients={ingredients}
                        justifyMode='center'
                    />
                </div>
            </motion.div>
            <motion.div
                variants={buildControlsVariants}
                custom={isFlexDirectionRow.matches}
                className={styles.buildControlsWrapper}
            >
                <BuildControls
                    addIngredient={onAddIngredient}
                    removeIngredient={onRemoveIngredient}
                    price={totalPrice || prices[0].bun}
                    purchasable={purchasable}
                    addToCart={() => addToCart(ingredients, isAuthed)}
                    showAddForm={showAddForm}
                    showUpdateForm={showUpdateForm}
                    prices={prices[0]}
                    userRole={userRole}
                    updatedBurger={updatedBurger}
                    ingredients={ingredients}
                />
            </motion.div>
        </motion.div>
    )

    let modalContent;
    if (modalToShow === 'addToCartUnauthed') modalContent = (
        <AuthMissing btnClicked={redirectToSignIn} />
    );
    else if (modalToShow === 'addToCartAuthed') modalContent = (
        <AsyncProgress
            error={cartError}
            loading={cartLoading}
            heading={{
                loading: 'Updating cart...',
                fail: 'Something went wrong!',
                success: 'Success!'
            }}
            mainContent={{
                fail: 'Unfortunately, an error occured while trying to add burger to cart.',
                success: 'Burger has been successfully added to cart.'
            }}
            buttons={{
                success: [{
                    theme: 'success',
                    content: 'Go to cart',
                    clickHandler: redirectToCart
                },
                {
                    theme: 'secondary',
                    content: 'Add more burgers',
                    clickHandler: () => setIsModalShowed(false)
                }],
                fail: [{
                    theme: 'danger',
                    content: 'Ok',
                    clickHandler: () => setIsModalShowed(false)
                }]
            }}
        />
    )
    else if (modalToShow === 'addMenuItemForm') modalContent = (
        <UpdateMenuForm
            ingredients={ingredients}
            onFormSubmit={addToMenu}
        />
    )
    else if (modalToShow === 'updateMenuItemForm') modalContent = (
        <UpdateMenuForm
            ingredients={ingredients}
            onFormSubmit={updateMenuItem}
            name={updatedBurger && updatedBurger.name}
            description={updatedBurger && updatedBurger.description}
            id={updatedBurger && updatedBurger.id}
        />
    )
    else modalContent = (
        <AsyncProgress
            error={adminError}
            loading={adminLoading}
            heading={{
                loading: 'Updating menu...',
                fail: 'Something went wrong!',
                success: 'Success!'
            }}
            mainContent={{
                fail: `Unfortunately, an error occured while trying to update menu. ${modalToShow === 'addToMenu' ? (
                    'Make sure that burger name, description and ingredients are unique.'
                ):(
                    'Make sure that burger name, description and ingredients are unique and at least one of these properties has been changed.'
                )} If that doesn't help, try again later.`,
                success: 'Menu has been successfully updated.'
            }}
            buttons={{
                success: [{
                    theme: 'success',
                    content: 'Ok',
                    clickHandler: getCloseModalFunction(modalToShow, adminError, cartError)
                }],
                fail: [{
                    theme: 'danger',
                    content: 'Ok',
                    clickHandler: getCloseModalFunction(modalToShow, adminError, cartError)
                }]
            }}
        />
    )

    return (
        <>
            <Modal
                isShowed={isModalShowed}
                closeModal={
                    getCloseModalFunction(modalToShow, adminError, cartError)
                }
            >
                {modalContent}
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
    burgerBuilder: {
        ingredients,
        totalPrice,
        purchasable
    },
    cart: {
        error,
        loading
    },
    firestore: {
        ordered,
        status,
        errors
    },
    firebase: {
        auth,
        profile: { role }
    },
    admin
}) => ({
    ingredients,
    totalPrice,
    purchasable,
    cartError: error,
    cartLoading: loading,
    pricesRequested: status.requested.prices,
    pricesError: errors.allIds.includes('prices'),
    prices: ordered.prices,
    isAuthed: !!auth.uid,
    userRole: role,
    adminError: admin.error,
    adminLoading: admin.loading,
    updatedBurger: admin.burgerData
});
const mapDispatchToProps = dispatch => ({
    onAddIngredient: (ingredientName, ingredientPrice) => {
        dispatch(actions.addIngredient(ingredientName, ingredientPrice))
    },
    onRemoveIngredient: (ingredientName, ingredientPrice) => {
        dispatch(actions.removeIngredient(ingredientName, ingredientPrice))
    },
    onClearIngredients: () => dispatch(actions.clearIngredients()),
    onAddToCart: item => dispatch(actions.addItem(item)),
    onAddToMenu: burgerData => dispatch(actions.addMenuItem(burgerData)),
    onUpdateMenuItem: burgerData => dispatch(actions.updateMenuItem(burgerData)),
    onClearBurgerData: () => dispatch(actions.clearBurgerData())
})
export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    firestoreConnect([
        { collection: 'ingredients', doc: 'prices', storeAs: 'prices' }
    ])
)(BurgerBuilder);