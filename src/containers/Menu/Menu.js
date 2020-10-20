import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../../components/UI/Button/Button';
import BurgerCard from '../../components/BurgerCard/BurgerCard';
import Modal from '../../components/UI/Modal/Modal';
import Card from '../../components/UI/Card/Card';
import PageHeading from '../../components/UI/PageHeading/PageHeading';
import AsyncProgress from '../../components/UI/Modal/AsyncProgress/AsyncProgress';
import AuthMissing from '../../components/UI/Modal/AuthMissing/AuthMissing';
import Spinner from '../../components/UI/Spinner/Spinner';
import styles from './Menu.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import icons from '../../shared/icons';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { firestoreConnect } from 'react-redux-firebase';
import * as actions from '../../store/actions';
import {
    variantsProps,
    containerVariants,
    fadeVariants,
    translateXVariants,
    translateYVariants
} from '../../shared/utility';

const ingredientsPortions = [
    {
        name: 'bacon',
        weight: '12g',
        quantityEquivalent: '(1 slice)'
    },
    {
        name: 'cheese',
        weight: '14g',
        quantityEquivalent: '(1 slice)'
    },
    {
        name: 'meat',
        weight: '150g',
        quantityEquivalent: '(1 steak)'
    },
    {
        name: 'salad',
        weight: '8g',
        quantityEquivalent: '(1 leaf)'
    },
];

const Menu = ({
    history,
    onAddToCart,
    onRemoveFromMenu,
    onSetIngredients,
    onSetBurgerData,
    burgers,
    cartError,
    cartLoading,
    menuError,
    menuRequested,
    isAuthed,
    userRole,
    userId,
    adminError,
    adminLoading
}) => {
    const [isModalShowed, setIsModalShowed] = useState(false);
    const [modalToShow, setModalToShow] = useState('');

    const addToCart = ({ name, ingredients }, isAuthed) => {
        if (isAuthed) {
            setModalToShow('addToCartAuthed');
            onAddToCart({ name, ingredients });
        } else setModalToShow('addToCartUnauthed');
        setIsModalShowed(true);
    }
    const removeFromMenu = (id) => {
        setModalToShow('removeFromMenu');
        onRemoveFromMenu(id);
        setIsModalShowed(true);
    }
    const redirectToSignIn = () => {
        const state = {
            prevPath: history.location.pathname
        }
        history.push('/auth', state);
    }
    const redirectToCart = () => {
        setIsModalShowed(false);
        history.push('/cart');
    }
    const redirectToBuilder = () => {
        history.push('/builder');
    }
    const redirectToUpdate = ({
        id,
        name,
        description,
        ingredients,
        price
    }) => {
        onSetIngredients(ingredients, price);
        onSetBurgerData({ id, name, description });
        redirectToBuilder();
    }

    const pageHeading = (
        <motion.div
            variants={translateYVariants}
            custom={true}
        >
            <PageHeading>Menu</PageHeading>
        </motion.div>
    );
    const redirectBtns = (
        <>
            <Button
                gradient
                clicked={redirectToBuilder}
            >
                Build custom burger
            </Button>
            {
                userRole &&
                ['admin', 'super admin'].includes(userRole) &&
                <Button
                    gradient
                    clicked={redirectToBuilder}
                >
                    Add menu burger
                </Button>
            }
        </>
    )

    let pageContent;
    if (!menuRequested) pageContent = (
        <motion.div
            key='spinner'
            variants={fadeVariants}
            {...variantsProps}
        >
            <Spinner withFullPageWrapper large />
        </motion.div>
    )
    else if (menuError) pageContent = (
        <motion.div
            key='contentFail'
            className={styles.menu}
            variants={fadeVariants}
            {...variantsProps}
        >
            {pageHeading}
            <motion.div
                className={styles.redirectSection}
                variants={translateYVariants}
                custom={false}
            >
                <p className='info'>
                    Unfortunately, an error occured while trying to load menu items. Please, try again later or build custom burger.
                </p>
                {redirectBtns}
            </motion.div>
        </motion.div>
    )
    else pageContent = (
        <motion.div
            key='contentSuccess'
            className={styles.menu}
            variants={fadeVariants}
            {...variantsProps}
        >
            {pageHeading}
            <motion.div
                variants={translateXVariants}
                custom={false}
            >
                <Card
                    destination='portionsInfo'
                >
                    <div className={styles.portionsInfo}>
                        <h2>Ingredients portions</h2>
                        <p>One portion of:</p>
                        <ul>
                            {ingredientsPortions.map(({ name, weight, quantityEquivalent }) => (
                                <li key={name}>
                                    <span>
                                        <FontAwesomeIcon icon={icons.faHamburger} />{name}
                                    </span>
                                    <span>
                                        =
                                    </span>
                                    <span>
                                        {weight}
                                    </span>
                                    <span>
                                        {quantityEquivalent}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </Card>
            </motion.div>
            <div className={styles.items}>
                {burgers.map((burger, index) => (
                    <motion.div
                        key={burger.id}
                        variants={translateXVariants}
                        custom={(index + 1) % 2}
                        className={styles.burgerCardWrapper}
                    >
                        <BurgerCard
                            burgerInfo={burger}
                            cartBtnClicked={() => addToCart(burger, isAuthed)}
                            removeBtnClicked={() => removeFromMenu(burger.id)}
                            updateBtnClicked={() => redirectToUpdate(burger)}
                            userRole={userRole}
                            userId={userId}
                        />
                    </motion.div>
                ))}
            </div>
            <motion.div
                className={styles.redirectSection}
                variants={translateYVariants}
                custom={false}
            >
                <h2>Couldn't find a burger matching your needs?</h2>
                {redirectBtns}
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
    else modalContent = (
        <AsyncProgress
            error={adminError}
            loading={adminLoading}
            heading={{
                loading: 'Removing item...',
                fail: 'Something went wrong!',
                success: 'Success!'
            }}
            mainContent={{
                fail: 'Unfortunately, an error occured while trying to remove item from menu.',
                success: 'Item has been successfully removed from menu.'
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
    )

    return (
        <>
            <Modal
                isShowed={isModalShowed}
                closeModal={() => setIsModalShowed(false)}
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
    cartError: error,
    cartLoading: loading,
    burgers: ordered.menu,
    menuRequested: status.requested.menu,
    menuError: errors.allIds.includes('menu'),
    isAuthed: !!auth.uid,
    userId: auth.uid,
    userRole: role,
    adminError: admin.error,
    adminLoading: admin.loading
})
const mapDispatchToProps = dispatch => ({
    onAddToCart: item => dispatch(actions.addItem(item)),
    onRemoveFromMenu: id => dispatch(actions.removeMenuItem(id)),
    onSetIngredients: (ingredients, totalPrice) => {
        dispatch(actions.setIngredients(ingredients, totalPrice))
    },
    onSetBurgerData: burgerData => {
        dispatch(actions.setBurgerData(burgerData))
    }
})
export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    firestoreConnect([
        { collection: 'menu' },
    ])
)(Menu)