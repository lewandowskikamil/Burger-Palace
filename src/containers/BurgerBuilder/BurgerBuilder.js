import React, { useState } from 'react';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import Spinner from '../../components/UI/Spinner/Spinner';
import SlimButton from '../../components/UI/SlimButton/SlimButton';
import AddingConfirmation from '../../components/AddingConfirmation/AddingConfirmation';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { firestoreConnect } from 'react-redux-firebase';
import * as actions from '../../store/actions';
import styles from './BurgerBuilder.module.css';

const BurgerBuilder = ({
    history,
    onAddIngredient,
    onRemoveIngredient,
    onClearIngredients,
    onAddToCart,
    ingredients,
    totalPrice,
    purchasable,
    cartError,
    cartLoading,
    prices,
    pricesRequested,
    pricesError,
    isAuthed
}) => {
    const [isModalShowed, setIsModalShowed] = useState(false);
    const [addedBurger, setAddedBurger] = useState(null);
    const addToCart = (ingredients, totalPrice) => {
        if (isAuthed) {
            const item = {
                name: 'Custom burger',
                ingredients,
            }
            onAddToCart(item);
            setAddedBurger({
                ...item,
                price: totalPrice
            });
        }
        setIsModalShowed(true);
    }
    const redirectToCart = () => {
        onClearIngredients();
        history.push('/cart');
    }
    const redirectToSignIn = () => {
        const state = {
            prevPath: history.location.pathname
        }
        history.push('/auth', state);
    }
    const dismissModal = (err) => {
        if (!err) onClearIngredients();
        setIsModalShowed(false);
    }

    if (!pricesRequested) return (
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
    if (pricesError) return (
        <p>Unfortunately, an error occured while trying to fetch ingredient prices from our database. Please, try again later.</p>
    )

    const availableIngredients = ['bacon', 'cheese', 'meat', 'salad'];
    const disabledInfo = {};
    availableIngredients.forEach(ingredient => {
        disabledInfo[ingredient] = !ingredients.includes(ingredient);
    });

    let modalContent = null;
    if (isModalShowed && !isAuthed) modalContent = (
        <div>
            <h2 className='danger'>You're not signed in!</h2>
            <p>Only authenticated users can add items to cart. Authentication will take you just a moment.</p>
            <SlimButton
                btnType='success'
                clicked={redirectToSignIn}
            >
                Sign In
            </SlimButton>
        </div>
    );
    if (isModalShowed && isAuthed) modalContent = (
        <AddingConfirmation
            burgerDetails={addedBurger}
            dismissModal={() => dismissModal(cartError)}
            redirectToCart={redirectToCart}
            error={cartError}
            loading={cartLoading}
            addItem={onAddToCart}
        />
    )

    return (
        <>
            <Modal
                show={isModalShowed}
                modalClosed={() => dismissModal(cartError)}
            >
                {modalContent}
            </Modal>
            <div className={styles.burgerWrapper}>
                <Burger ingredients={ingredients} />
            </div>
            <BuildControls
                addIngredient={onAddIngredient}
                removeIngredient={onRemoveIngredient}
                disabled={disabledInfo}
                price={totalPrice || prices[0].bun}
                purchasable={purchasable}
                addToCart={()=>addToCart(ingredients, totalPrice)}
                prices={prices[0]}
            />
        </>
    )
}

const mapStateToProps = ({
    burger: {
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
        auth
    }
}) => ({
    ingredients,
    totalPrice,
    purchasable,
    cartError: error,
    cartLoading: loading,
    pricesRequested:status.requested.prices,
    pricesError:errors.allIds.includes('prices'),
    prices: ordered.prices,
    isAuthed: !!auth.uid
});
const mapDispatchToProps = dispatch => ({
    onAddIngredient: (ingredientName, ingredientPrice) => {
        dispatch(actions.addIngredient(ingredientName, ingredientPrice))
    },
    onRemoveIngredient: (ingredientName, ingredientPrice) => {
        dispatch(actions.removeIngredient(ingredientName, ingredientPrice))
    },
    onClearIngredients: () => dispatch(actions.clearIngredients()),
    onAddToCart: item => dispatch(actions.addItem(item))
})
export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    firestoreConnect([
        { collection: 'ingredients', doc: 'prices', storeAs:'prices' },
    ])
)(BurgerBuilder);