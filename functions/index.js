const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

exports.addToCart = functions.https.onCall(async (data = {}, context) => {
    // INITIAL CHECKS

    // check if user is authenticated
    if (!context.auth) {
        throw new functions.https.HttpsError(
            'permission-denied',
            'Only authenticated users can update cart content.'
        );
    }
    // check if passed data is an object
    if (!(typeof data === 'object' && data !== null)) {
        throw new functions.https.HttpsError(
            'invalid-argument',
            'Data is expected to be an object.'
        );
    }
    const { name = '', ingredients = '' } = data;
    // check if burger name is non-empty string
    if (!(typeof name === 'string' && name.length)) {
        throw new functions.https.HttpsError(
            'invalid-argument',
            'Burger name is expected to be non-empty string.'
        );
    }
    // check if burger name is either one of menu burger names or 'Custom burger'
    const menuItemsRef = admin.firestore().collection('menu');
    const menuItemRef = menuItemsRef.where('name', '==', name);
    const menuItemSnapshot = await menuItemRef.get();
    if (menuItemSnapshot.empty && name !== 'Custom burger') {
        throw new functions.https.HttpsError(
            'invalid-argument',
            'Burger name is not valid - it\'s neither one of menu burger names nor "Custom burger"'
        );
    }
    if (name === 'Custom burger') {
        // check if ingredients are non-empty array
        if (!(Array.isArray(ingredients) && ingredients.length)) {
            throw new functions.https.HttpsError(
                'invalid-argument',
                'Ingredients are expected to be array elements.'
            );
        }
        // check if ingredients are valid
        const ingredientPricesRef = admin.firestore().collection('ingredients').doc('prices');
        const ingredientPrices = await ingredientPricesRef.get();
        const ingredientPricesKeys = Object.keys(ingredientPrices.data());
        const ingredientsChecker = (arr, target) => target.every(item => arr.includes(item));
        const ingredientsAreValid = ingredientsChecker(ingredientPricesKeys, ingredients);
        if (!ingredientsAreValid) {
            throw new functions.https.HttpsError(
                'invalid-argument',
                'Not all passed ingredients are valid.'
            );
        }
    }

    // CORE FUNCTIONALITY

    // check if user has a cart
    // if not, which may be the case only due to userSignedUp function error, create one
    const cartRef = admin.firestore().collection('carts').doc(context.auth.uid);
    const cart = await cartRef.get();
    if (!cart.exists) await cartRef.set({
        totalPrice: 0
    })

    // check if burger which user want to add already exists in cartBurgers subcollection
    // if so, increase its amount and price
    // if not add that burger to the cartBurgers subcollection
    // then increase cart total price

    const cartBurgersRef = cartRef.collection('cartBurgers');
    const cartBurgerRef = cartBurgersRef
        .where('ingredients', '==', ingredients)
        .where('name', '==', name);
    const cartBurgerSnapshot = await cartBurgerRef.get();
    if (cartBurgerSnapshot.empty) {
        // check if it's menu burger
        // if so, just add it to the cart
        // otherwise, calculate custom burger cost and then add it
        const burgerData = {
            name,
            userId: context.auth.uid,
            amount: 1
        };
        if (!menuItemSnapshot.empty) {
            // there will be just one iteration
            menuItemSnapshot.forEach(item => {
                const { ingredients, price } = item.data();
                burgerData.ingredients = ingredients;
                burgerData.price = price;
                burgerData.unitPrice = price;
            })
        } else {
            // get prices to calculate burger cost
            const ingredientPricesRef = admin.firestore().collection('ingredients').doc('prices');
            const ingredientPricesDoc = await ingredientPricesRef.get();
            const ingredientPrices = ingredientPricesDoc.data();
            console.log(ingredientPrices);
            // calculate burger cost
            // calculate ingredients cost
            const ingredientsCost = ingredients.reduce((acc, ingredient) => (
                acc + ingredientPrices[ingredient]
            ), 0);
            // add base price
            const burgerPrice = ingredientsCost + ingredientPrices.bun;
            burgerData.ingredients = ingredients;
            burgerData.price = burgerPrice;
            burgerData.unitPrice = burgerPrice;
        }

        // add new burger to the burgers collection in the cart
        await cartBurgersRef.add(burgerData)
        // update total cost of the burgers
        await cartRef.update({
            totalPrice: admin.firestore.FieldValue.increment(burgerData.unitPrice)
        })
    } else {
        // grab the id and unit price of the existing burger
        // unit price - price of the single burger with the particular name and ingredients
        let burgerId;
        let burgerUnitPrice;
        cartBurgerSnapshot.forEach(doc => {
            burgerId = doc.id;
            burgerUnitPrice = doc.data().unitPrice;
        });
        // update price and amount of the burger
        await cartBurgersRef.doc(burgerId).update({
            amount: admin.firestore.FieldValue.increment(1),
            price: admin.firestore.FieldValue.increment(burgerUnitPrice)
        })
        // update total cost of the cart burgers
        await cartRef.update({
            totalPrice: admin.firestore.FieldValue.increment(burgerUnitPrice)
        })
    }
    return 'Burger successfully added.'
})

exports.removeFromCart = functions.https.onCall(async (burgerId = '', context) => {
    // INITIAL CHECKS

    // check if user is authenticated
    if (!context.auth) {
        throw new functions.https.HttpsError(
            'permission-denied',
            'Only authenticated users can update cart content.'
        );
    }
    // check if user has a cart
    const cartRef = admin.firestore().collection('carts').doc(context.auth.uid);
    const cart = await cartRef.get();
    if (!cart.exists) {
        throw new functions.https.HttpsError(
            'failed-precondition',
            'You can\'t remove item from non-existent cart.'
        );
    }
    // check if burger id is non-empty string
    if (!(typeof burgerId === 'string' && burgerId.length)) {
        throw new functions.https.HttpsError(
            'invalid-argument',
            'Burger id is expected to be non-empty string'
        );
    }
    // check if burger exists
    const cartBurgerRef = cartRef.collection('cartBurgers').doc(burgerId);
    const cartBurger = await cartBurgerRef.get();
    if (!cartBurger.exists) {
        throw new functions.https.HttpsError(
            'not-found',
            'There\'s no burger with the specified id in the cart.'
        );
    }

    // CORE FUNCTIONALITY

    // get amount of the burger that is about to be removed
    const { amount, unitPrice } = cartBurger.data();
    // if there's more than one, just reduce the amount
    // otherwise, remove it altogether
    if (amount > 1) {
        await cartBurgerRef.update({
            amount: admin.firestore.FieldValue.increment(-1),
            price: admin.firestore.FieldValue.increment(-unitPrice)
        })
    } else {
        await cartBurgerRef.delete();
    }
    // then update also total price of the cart
    await cartRef.update({
        totalPrice: admin.firestore.FieldValue.increment(-unitPrice)
    })
    return 'Burger successfully removed';
})


exports.resetCart = functions.https.onCall(async (data = {}, context) => {
    // INITIAL CHECKS

    // check if user is authenticated
    if (!context.auth) {
        throw new functions.https.HttpsError(
            'permission-denied',
            'Only authenticated users can update cart content.'
        );
    }
    // check if user has a cart
    const cartRef = admin.firestore().collection('carts').doc(context.auth.uid);
    const cart = await cartRef.get();
    if (!cart.exists) {
        throw new functions.https.HttpsError(
            'failed-precondition',
            'You can\'t clear non-existent cart.'
        );
    }
    // check if there are any burgers in the cart
    const cartBurgersRef = cartRef.collection('cartBurgers');
    const cartBurgersSnapshot = await cartBurgersRef.get();
    if (cartBurgersSnapshot.empty) {
        throw new functions.https.HttpsError(
            'failed-precondition',
            'You can\'t clear empty cart.'
        );
    }

    // CORE FUNCTIONALITY
    const promises = [];
    cartBurgersSnapshot.forEach(burger => promises.push(burger.ref.delete()));
    await Promise.all(promises);
    await cartRef.update({
        totalPrice: 0
    })
    return 'Cart successfully cleared';
})

exports.addOrder = functions.https.onCall(async (data = {}, context) => {
    // INITIAL CHECKS

    // check if user is authenticated
    if (!context.auth) {
        throw new functions.https.HttpsError(
            'permission-denied',
            'Only authenticated users can make an order'
        );
    }
    // check if user has a cart
    const cartRef = admin.firestore().collection('carts').doc(context.auth.uid);
    const cart = await cartRef.get();
    if (!cart.exists) {
        throw new functions.https.HttpsError(
            'failed-precondition',
            'Your order must consist of at least one burger.'
        );
    }
    // check if there are any burgers in the cart
    const cartBurgersRef = cartRef.collection('cartBurgers');
    const cartBurgersSnapshot = await cartBurgersRef.get();
    if (cartBurgersSnapshot.empty) {
        throw new functions.https.HttpsError(
            'failed-precondition',
            'Your order must consist of at least one burger.'
        );
    }
    // check if passed data is an object
    if (!(typeof data === 'object' && data !== null)) {
        throw new functions.https.HttpsError(
            'invalid-argument',
            'Data is expected to be an object.'
        );
    }
    const { fullName = '', phoneNumber = '', address = '' } = data;
    // check if user provided valid deliveryData
    if (!(typeof fullName === 'string' && fullName.length)) {
        throw new functions.https.HttpsError(
            'invalid-argument',
            'You have to provide your name.'
        );
    }
    if (!(typeof address === 'string' && address.length > 1)) {
        throw new functions.https.HttpsError(
            'invalid-argument',
            'Your address must be at least 2 characters long.'
        );
    }
    if (!(typeof phoneNumber === 'string' && phoneNumber.length)) {
        throw new functions.https.HttpsError(
            'invalid-argument',
            'Your phone number must be a string consisting of 9 digits.'
        );
    }
    const phoneNumberCharacters = phoneNumber.split('');
    const numbers = '1234567890'.split('');
    const phoneNumberChecker = (arr, target) => target.every(item => arr.includes(item));
    const isPhoneNumberValid = phoneNumberCharacters.length === 9 &&
        phoneNumberChecker(numbers, phoneNumberCharacters);
    if (!isPhoneNumberValid) {
        throw new functions.https.HttpsError(
            'invalid-argument',
            'Your phone number must be a string consisting of 9 digits.'
        );
    }

    // CORE FUNCTIONALITY

    // get burgers and total price from the cart
    const burgersData = [];
    cartBurgersSnapshot.forEach(burger => burgersData.push(burger.data()));
    const totalPrice = cart.data().totalPrice;
    // create order
    const ordersRef = admin.firestore().collection('orders');
    const { id: orderId } = await ordersRef.add({
        userId: context.auth.uid,
        orderTimestamp: admin.firestore.FieldValue.serverTimestamp(),
        data
    })
    const orderRef = ordersRef.doc(orderId);
    const orderBurgersRef = orderRef.collection('orderBurgers');
    // add subcollection with burgers to the order
    const promises = burgersData.map(burger => orderBurgersRef.add({
        ...burger,
        orderId,
        userId: context.auth.uid
    }));
    await Promise.all(promises);
    // add order price
    await orderRef.update({
        totalPrice
    });
    return 'Order successfully added.';
})

exports.userSignedUp = functions.auth.user()
    .onCreate(async ({ uid, email }) => {
        const roleRef = admin.firestore().collection('roles').doc(uid);
        await roleRef.set({
            email,
            role: 'user'
        })
        const cartRef = admin.firestore().collection('carts').doc(uid);
        await cartRef.set({
            totalPrice: 0
        })
        return 'User role and cart successfully created.'
    });

exports.userRoleChanged = functions.firestore
    .document('roles/{userId}')
    .onUpdate(async (change, context) => {
        // get doc id
        const { userId } = context.params;
        // get new role
        const { role } = change.after.data();
        // assign new role to user doc in users collection
        const userRef = admin.firestore().collection('users').doc(userId);
        await userRef.update({
            role
        });
        return 'User role successfully changed.'
    });