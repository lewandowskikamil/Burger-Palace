import React, { useState } from 'react';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
// import Spinner from '../../components/UI/Spinner/Spinner';
import AddingConfirmation from '../../components/AddingConfirmation/AddingConfirmation';
import { connect } from 'react-redux';
import * as actions from '../../store/actions';
import styles from './BurgerBuilder.module.css';

const BurgerBuilder = ({
    // isAuthed,
    history,
    // onSetAuthRedirectPath,
    // onPurchaseInit,
    onIngredientAdded,
    onIngredientRemoved,
    onIngredientsCleared,
    // onIngredientsInit,
    onAddToCart,
    ingredients,
    totalPrice,
    purchasable,
}) => {
    //     const [purchasing, setPurchasing] = useState(false);
    //     const purchaseHandler = (purchasing) => {
    //         if (isAuthed) setPurchasing(purchasing);
    //         else {
    //             onSetAuthRedirectPath('/checkout');
    //             history.push('/auth');
    //         }
    //     }
    //     const purchaseContinueHandler = () => {
    //         onPurchaseInit();
    //         history.push('/checkout');

    // }
    const [isModalShowed, setIsModalShowed] = useState(false);
    const [lastAddedBurger, setLastAddedBurger] = useState(null);
    const addToCartHandler = (ingredients, price) => {
        const item = {
            id: Date.parse(new Date()),
            name: 'Custom burger',
            ingredients,
            price,
            amount: 1
        }
        onAddToCart(item);
        setLastAddedBurger(item);
        setIsModalShowed(true);
    }
    const redirectPageHandler=()=>{
        onIngredientsCleared();
        history.push('/cart');
    }
    const dismissModalHandler=()=>{
        onIngredientsCleared();
        setIsModalShowed(false);
    }
    // useEffect(() => {
    //     onIngredientsInit()
    // }, [onIngredientsInit])

    const disabledInfo = {
        ...ingredients
    }
    for (const key in disabledInfo) {
        disabledInfo[key] = !disabledInfo[key]
    }
    // let orderSummary = null;
    // let burger = error ? (
    //     <p
    //         style={{
    //             padding: '10px',
    //             textAlign: 'center'
    //         }}
    //     >
    //         Sorry, at the moment ingredients can't be loaded. Please, try again later.
    //     </p>
    // ) : (
    //         <div
    //             style={{
    //                 height: '80vh',
    //                 display: 'flex',
    //                 justifyContent: 'center',
    //                 alignItems: 'center'
    //             }}
    //         >
    //             <Spinner />
    //         </div>
    //     )
    // if (ingredients) {
    //     orderSummary = (
    //         <OrderSummary
    //             ingredients={ingredients}
    //             canceled={() => purchaseHandler(false)}
    //             continued={purchaseContinueHandler}
    //             price={totalPrice}
    //         />
    //     )
    //     burger = (
    //         <>
    //             <div className={styles.burgerWrapper}>
    //                 <Burger ingredients={ingredients} />
    //             </div>
    //             <BuildControls
    //                 ingredientAdded={onIngredientAdded}
    //                 ingredientRemoved={onIngredientRemoved}
    //                 disabled={disabledInfo}
    //                 price={totalPrice}
    //                 purchasable={purchasable}
    //                 addedToCart={() => addToCartHandler(ingredients, totalPrice)}
    //             />
    //         </>
    //     )
    // }

    return (
        <>
            <Modal
                show={isModalShowed}
                modalClosed={() => setIsModalShowed(false)}
            >
                {lastAddedBurger && <AddingConfirmation
                    burgerDetails={lastAddedBurger}
                    modalDismissed={dismissModalHandler}
                    pageRedirected={redirectPageHandler}
                />}
            </Modal>
            <div className={styles.burgerWrapper}>
                <Burger ingredients={ingredients} />
            </div>
            <BuildControls
                ingredientAdded={onIngredientAdded}
                ingredientRemoved={onIngredientRemoved}
                disabled={disabledInfo}
                price={totalPrice}
                purchasable={purchasable}
                addedToCart={() => addToCartHandler(ingredients, totalPrice)}
            />
        </>
    );
}

const mapStateToProps = ({
    burger: { ingredients, totalPrice, purchasable }
}) => ({
    ingredients,
    totalPrice,
    purchasable
});
const mapDispatchToProps = dispatch => ({
    onIngredientAdded: ingredientName => {
        dispatch(actions.addIngredient(ingredientName))
    },
    onIngredientRemoved: ingredientName => {
        dispatch(actions.removeIngredient(ingredientName))
    },
    // onIngredientsInit: () => {
    //     dispatch(actions.initIngredients())
    // },
    // onPurchaseInit: () => {
    //     dispatch(actions.purchaseInit())
    // },
    // onSetAuthRedirectPath: (path) => {
    //     dispatch(actions.setAuthRedirectPath(path))
    // },
    onIngredientsCleared: () => dispatch(actions.clearIngredients()),
    onAddToCart: item => dispatch(actions.addCartItem(item))
})

export default connect(mapStateToProps, mapDispatchToProps)(BurgerBuilder);