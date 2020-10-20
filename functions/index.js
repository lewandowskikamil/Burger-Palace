const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

// validators
const validateString = (name, value) => {
    if (typeof value !== 'string' || !value.trim().length) {
        throw new functions.https.HttpsError(
            'invalid-argument',
            `${name} must be non-empty-string`
        );
    }
}
const validateObject = (name, value) => {
    if (typeof value !== 'object' || value === null) {
        throw new functions.https.HttpsError(
            'invalid-argument',
            `${name} must be an object.`
        );
    }
}
const validateArray = (name, value) => {
    if (!Array.isArray(value) || !value.length) {
        throw new functions.https.HttpsError(
            'invalid-argument',
            `${name} must be non-empty array.`
        );
    }
}
const validateAuthStatus = context => {
    if (!context.auth) {
        throw new functions.https.HttpsError(
            'permission-denied',
            'Only authenticated users can perform this action.'
        );
    }
}
const validatePermissions = async (context, acceptableRoles, adminMustBeAuthor, item) => {
    const roleRef = admin.firestore().collection('roles').doc(context.auth.uid);
    const role = await roleRef.get();
    const roleValue = role.data().role;
    if (!acceptableRoles.includes(roleValue) || (
        roleValue === 'admin' &&
        adminMustBeAuthor &&
        item.authorId !== context.auth.uid)) {
        throw new functions.https.HttpsError(
            'permission-denied',
            'This action can\'t be performed owing to insufficient permissions.'
        );
    }
};
const validateArrayElements = (primaryArray, inspectedArray, inspectedArrayName) => {
    const allElementsIncluded = (primaryArray, inspectedArray) => (
        inspectedArray.every(element => primaryArray.includes(element))
    );
    if (!allElementsIncluded(primaryArray, inspectedArray)) {
        throw new functions.https.HttpsError(
            'invalid-argument',
            `Not all ${inspectedArrayName} are valid.`
        );
    }
}
const validateExistence = async (itemId, collectionRef, itemName) => {
    const itemRef = collectionRef.doc(itemId);
    const item = await itemRef.get();
    if (!item.exists) {
        throw new functions.https.HttpsError(
            'invalid-argument',
            `There is no ${itemName} with the given id.`
        );
    } else return [item, itemRef];
}
const validateCollection = async (collectionRef, collectionName) => {
    const collectionSnapshot = await collectionRef.get();
    if (collectionSnapshot.empty) {
        throw new functions.https.HttpsError(
            'failed-precondition',
            `There are no ${collectionName}.`
        );
    } else return collectionSnapshot;
}
const validateUniqueness = (items, name, description, ingredients) => {
    const existingBurger = items.find(item => {
        const stringsToProcess = [item.name, item.description, name, description];
        const [
            itemNameProcessed,
            itemDescrProcessed,
            nameProcessed,
            descrProcessed
        ] = stringsToProcess.map(string => (
            string
                .toLowerCase()
                .split('')
                .filter(character => Boolean(character.trim().length))
                .join('')
        ))
        return [...item.ingredients].sort().join('') === [...ingredients].sort().join('') ||
            itemNameProcessed === nameProcessed ||
            itemDescrProcessed === descrProcessed
    })
    if (existingBurger) {
        throw new functions.https.HttpsError(
            'failed-precondition',
            'There\'s already a burger with given name, ingredients or description in the menu.'
        );
    }
}

exports.addToCart = functions.https
    .onCall(async (data, context) => {
        // user is authenticated
        validateAuthStatus(context);
        // data is an object
        validateObject('Burger data', data);
        const { name, ingredients } = data;
        // burger name is non-empty string
        validateString('Burger name', name);
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
            // ingredients
            // is non-empty array
            validateArray('Ingredients', ingredients);
            // consists of valid elements
            const ingredientPricesRef = admin.firestore().collection('ingredients').doc('prices');
            const ingredientPrices = await ingredientPricesRef.get();
            const ingredientPricesData = ingredientPrices.data();
            const ingredientPricesKeys = Object.keys(ingredientPricesData);
            validateArrayElements(ingredientPricesKeys, ingredients, 'ingredients');
        }

        // if user doesn't have a cart
        // which may be the case only due to userSignedUp function error, create one
        const cartRef = admin.firestore().collection('carts').doc(context.auth.uid);
        const cart = await cartRef.get();
        if (!cart.exists) await cartRef.set({
            totalPrice: 0
        })
        // if burger which user want to add already exists in cartBurgers subcollection
        // increase its amount and price
        // else add that burger to the subcollection
        // then increase cart total price
        const cartBurgersRef = cartRef.collection('cartBurgers');
        const cartBurgerRef = cartBurgersRef
            .where('ingredients', '==', ingredients)
            .where('name', '==', name);
        const cartBurgerSnapshot = await cartBurgerRef.get();
        if (cartBurgerSnapshot.empty) {
            // if it's menu burger
            // add it to the cart
            // else calculate custom burger cost and then add it
            const burgerData = {
                name,
                userId: context.auth.uid,
                ingredients,
                amount: 1
            };
            if (!menuItemSnapshot.empty) {
                // get menu burger price
                // there is just one item in the snapshot
                menuItemSnapshot.forEach(item => {
                    const { ingredients, price } = item.data();
                    // set that price as totalPrice and unitPrice prop of burgerData
                    // totalPrice = unitPrice * amount
                    burgerData.price = price;
                    burgerData.unitPrice = price;
                })
            } else {
                // get ingredient prices
                const ingredientPricesRef = admin.firestore().collection('ingredients').doc('prices');
                const ingredientPrices = await ingredientPricesRef.get();
                const ingredientPricesData = ingredientPrices.data();
                // calculate burger price
                const burgerPrice = ingredients.reduce((price, ingredient) => (
                    price + ingredientPricesData[ingredient]
                ), ingredientPricesData.bun);
                // set that price as totalPrice and unitPrice prop of burgerData
                burgerData.price = burgerPrice;
                burgerData.unitPrice = burgerPrice;
            }

            // add new burger to the cartBurgers subcollection
            await cartBurgersRef.add(burgerData)
            // also increment total price of the cart
            await cartRef.update({
                totalPrice: admin.firestore.FieldValue.increment(burgerData.unitPrice)
            })
        } else {
            // get the id and unit price of the existing cart burger
            let burgerId;
            let burgerUnitPrice;
            cartBurgerSnapshot.forEach(doc => {
                burgerId = doc.id;
                burgerUnitPrice = doc.data().unitPrice;
            });
            // increment price and amount of the cart burger
            await cartBurgersRef.doc(burgerId).update({
                amount: admin.firestore.FieldValue.increment(1),
                price: admin.firestore.FieldValue.increment(burgerUnitPrice)
            })
            // also increment total price of the cart
            await cartRef.update({
                totalPrice: admin.firestore.FieldValue.increment(burgerUnitPrice)
            })
        }
        return 'Burger successfully added.'
    });

exports.removeFromCart = functions.https
    .onCall(async (burgerId, context) => {
        // user
        // is authenticated
        validateAuthStatus(context);
        // has a cart
        const cartsRef = admin.firestore().collection('carts');
        const [cart, cartRef] = await validateExistence(context.auth.uid, cartsRef, 'cart');
        // burger id
        // is non-empty string
        validateString('Burger id', burgerId);
        // is assigned to existing burger
        const cartBurgersRef = cartRef.collection('cartBurgers')
        const [cartBurger, cartBurgerRef] = await validateExistence(burgerId, cartBurgersRef, 'burger');
        // get amount and unit price of the burger
        const { amount, unitPrice } = cartBurger.data();
        // if the amount is greater than one
        // decrement it along with the price
        // else remove it altogether
        if (amount > 1) {
            await cartBurgerRef.update({
                amount: admin.firestore.FieldValue.increment(-1),
                price: admin.firestore.FieldValue.increment(-unitPrice)
            })
        } else {
            await cartBurgerRef.delete();
        }
        // also decrement total price of the cart
        await cartRef.update({
            totalPrice: admin.firestore.FieldValue.increment(-unitPrice)
        })
        return 'Burger successfully removed';
    });

exports.resetCart = functions.https
    .onCall(async (data, context) => {
        // user
        // is authenticated
        validateAuthStatus(context);
        // has a cart
        const cartsRef = admin.firestore().collection('carts');
        const [cart, cartRef] = await validateExistence(context.auth.uid, cartsRef, 'cart');
        // has added at least one burger to the cart
        const cartBurgersRef = cartRef.collection('cartBurgers');
        const cartBurgersSnapshot = await validateCollection(cartBurgersRef, 'burgers in cart');

        // remove all burgers from cartBurgers subcollection
        const promises = [];
        cartBurgersSnapshot.forEach(burger => promises.push(burger.ref.delete()));
        await Promise.all(promises);
        // update cart price to 0
        await cartRef.update({
            totalPrice: 0
        })
        return 'Cart successfully cleared';
    });

exports.addOrder = functions.https
    .onCall(async (data, context) => {
        // user
        // is authenticated
        validateAuthStatus(context);
        // has a cart
        const cartsRef = admin.firestore().collection('carts');
        const [cart, cartRef] = await validateExistence(context.auth.uid, cartsRef, 'cart');
        // has added at least one burger to the cart
        const cartBurgersRef = cartRef.collection('cartBurgers');
        const cartBurgersSnapshot = await validateCollection(cartBurgersRef, 'burgers in cart');
        // data is an object
        validateObject('Delivery data', data);
        const { fullName, phoneNumber, address } = data;
        // data properties are valid
        validateString('User name', fullName);
        validateString('User address', address);
        validateString('User phone number', phoneNumber);
        const phoneNumberCharacters = phoneNumber.split('');
        const numbers = '1234567890'.split('');
        validateArrayElements(numbers, phoneNumberCharacters, 'phone number characters');

        // get burgers data and total price from the cart
        const cartBurgersData = [];
        cartBurgersSnapshot.forEach(burger => cartBurgersData.push(burger.data()));
        const cartTotalPrice = cart.data().totalPrice;
        // create order
        const ordersRef = admin.firestore().collection('orders');
        const { id: orderId } = await ordersRef.add({
            userId: context.auth.uid,
            orderTimestamp: admin.firestore.FieldValue.serverTimestamp(),
            deliveryData: data
        })
        // add burgers to the order as orderBurgers subcollection
        const orderRef = ordersRef.doc(orderId);
        const orderBurgersRef = orderRef.collection('orderBurgers');
        const promises = cartBurgersData.map(burger => orderBurgersRef.add({
            ...burger,
            orderId
        }));
        await Promise.all(promises);
        // add price to the order
        await orderRef.update({
            totalPrice: cartTotalPrice
        });
        return 'Order successfully added.';
    });

exports.userSignedUp = functions.auth
    .user()
    .onCreate(async ({ uid, email }) => {
        // create role doc for newly created user
        const roleRef = admin.firestore().collection('roles').doc(uid);
        await roleRef.set({
            email,
            role: 'user'
        })
        // create cart doc for newly created user
        const cartRef = admin.firestore().collection('carts').doc(uid);
        await cartRef.set({
            totalPrice: 0
        })
        return 'User role and cart successfully created.'
    });

exports.changeUserRole = functions.https
    .onCall(async (data, context) => {
        // user
        // is authenticated
        validateAuthStatus(context);
        // is super admin 
        await validatePermissions(context, ['super admin']);
        // data is an object
        validateObject('Operation data', data);
        const { userId, operationType } = data;
        // user id
        // is non-empty string
        validateString('User id', userId);
        // is assigned to existing role doc
        const rolesRef = admin.firestore().collection('roles');
        const [changingRole, changingRoleRef] = await validateExistence(userId, rolesRef, 'role');
        const changingRoleValue = changingRole.data().role;
        // operation type is valid
        if (typeof operationType !== 'string' ||
            !['promote', 'degrade', 'make admin'].includes(operationType)) {
            throw new functions.https.HttpsError(
                'invalid-argument',
                `Operation type must be one of:
            -promote
            -degrade
            -make admin`
            );
        }
        // role can be changed
        if ((operationType === 'promote' && changingRoleValue === 'super admin') ||
            (operationType === 'degrade' && changingRoleValue === 'user') ||
            (operationType === 'make admin' && changingRoleValue !== 'user')) {
            throw new functions.https.HttpsError(
                'failed-precondition',
                `Role can't be changed in case you're trying to:
            -promote super admin
            -degrade user
            -make admin out of someone whose role is already (super) admin.`
            );
        }
        // determine new role
        let newRole;
        switch (operationType) {
            case 'promote':
                newRole = 'super admin'
                break;
            case 'degrade':
                newRole = changingRoleValue === 'admin' ? 'user' : 'admin';
                break;
            case 'make admin':
                newRole = 'admin'
                break;
        }
        // update role
        await changingRoleRef.update({
            role: newRole
        })
        return 'User role successfully changed.'
    });

exports.changeIngredientPrices = functions.https
    .onCall(async (data, context) => {
        // user
        // is authenticated
        validateAuthStatus(context);
        // is super admin 
        await validatePermissions(context, ['admin', 'super admin']);
        // data is an object
        validateObject('Ingredient prices', data);
        // has valid keys
        const dataKeys = Object.keys(data);
        const dataValues = Object.values(data);
        const ingredientPricesRef = admin.firestore().collection('ingredients').doc('prices');
        const ingredientPrices = await ingredientPricesRef.get();
        const ingredientPricesData = ingredientPrices.data();
        const ingredientPricesKeys = Object.keys(ingredientPricesData);
        validateArrayElements(ingredientPricesKeys, dataKeys, 'ingredients');
        // has valid values
        const pattern = /^\d*(\.\d{0,2})?$/;
        const areValuesValid = dataValues
            .every(value => pattern.test(value) && value > 0);
        if (!areValuesValid) {
            throw new functions.https.HttpsError(
                'invalid-argument',
                'Not all ingredient prices are positive numbers with max 2 decimals.'
            );
        }
        // at least one price has been changed
        let areValuesSame = true;
        for (const key in data) {
            areValuesSame = data[key] === ingredientPricesData[key] && areValuesSame;
        }
        if (areValuesSame) {
            throw new functions.https.HttpsError(
                'failed-precondition',
                'No change has been made to the ingredient prices.'
            );
        }

        await ingredientPricesRef.update(data);
        return 'Ingredient prices successfully changed.'
    })

exports.userRoleChanged = functions.firestore
    .document('roles/{userId}')
    .onUpdate(async (change, context) => {
        // get updated doc id
        const { userId } = context.params;
        // get updated role
        const { role } = change.after.data();
        // update role prop of user doc in users collection
        const userRef = admin.firestore().collection('users').doc(userId);
        await userRef.update({
            role
        });
        return 'User role successfully changed.'
    });

exports.ingredientPricesChanged = functions.firestore
    .document('ingredients/prices')
    .onUpdate(async change => {
        // get updated prices
        const updatedPrices = change.after.data();
        // get menu snapshot
        const menuItemsRef = admin.firestore().collection('menu');
        const menuItemsSnapshot = await menuItemsRef.get();
        const promises = [];
        // recalculate price of each menu item
        menuItemsSnapshot.forEach(item => {
            const { ingredients } = item.data();
            const updatedPrice = ingredients.reduce((price, ingredient) => (
                price + updatedPrices[ingredient]
            ), updatedPrices.bun);
            promises.push(item.ref.update({ price: updatedPrice }))
        });
        await Promise.all(promises);
        return 'Burger prices successfully updated.'
    });

exports.addToMenu = functions.https
    .onCall(async (data, context) => {
        // user
        // is authenticated
        validateAuthStatus(context);
        // is admin or super admin 
        await validatePermissions(context, ['admin', 'super admin']);
        // data is an object
        validateObject('Burger data', data);
        const { name, description, ingredients } = data;
        // ingredients
        // is non-empty array
        validateArray('Ingredients', ingredients);
        // consists of valid elements
        const ingredientPricesRef = admin.firestore().collection('ingredients').doc('prices');
        const ingredientPrices = await ingredientPricesRef.get();
        const ingredientPricesData = ingredientPrices.data();
        const ingredientPricesKeys = Object.keys(ingredientPricesData);
        validateArrayElements(ingredientPricesKeys, ingredients, 'ingredients');
        // name and description are non-empty strings
        validateString('Burger name', name);
        validateString('Burger description', description);

        // there's no burger with given name, description or ingredients
        const menuItemsRef = admin.firestore().collection('menu');
        const menuItemsSnapshot = await menuItemsRef.get();
        const menuItems = [];
        menuItemsSnapshot.forEach(item => menuItems.push(item.data()));
        validateUniqueness(menuItems, name, description, ingredients);

        // calculate price
        const price = ingredients.reduce((price, ingredient) => (
            price + ingredientPricesData[ingredient]
        ), ingredientPricesData.bun);
        // add burger to menu
        await menuItemsRef.add({
            name: name.trim(),
            description: description.trim(),
            ingredients,
            price,
            authorId: context.auth.uid
        })
        return 'Burger successfully added to the menu.'
    });

exports.updateMenuItem = functions.https
    .onCall(async (data, context) => {
        // user is authed
        validateAuthStatus(context);
        // data is an object
        validateObject('Burger data', data);
        const { name, description, ingredients, id } = data;
        // ingredients
        // is non-empty array
        validateArray('Ingredients', ingredients);
        // consists of valid elements
        const ingredientPricesRef = admin.firestore().collection('ingredients').doc('prices');
        const ingredientPrices = await ingredientPricesRef.get();
        const ingredientPricesData = ingredientPrices.data();
        const ingredientPricesKeys = Object.keys(ingredientPricesData);
        validateArrayElements(ingredientPricesKeys, ingredients, 'ingredients');
        // name, description and id are non-empty strings
        validateString('Burger name', name);
        validateString('Burger description', description);
        validateString('Burger id', id);
        // id is assigned to existing menu burger
        const menuItemsRef = admin.firestore().collection('menu');
        const menuItemsSnapshot = await menuItemsRef.get();
        let updatedItem;
        const otherItems = [];
        menuItemsSnapshot.forEach(item => {
            if (item.id === id) updatedItem = item.data()
            else otherItems.push(item.data())
        });
        if (!updatedItem) {
            throw new functions.https.HttpsError(
                'invalid-argument',
                'There is no burger with the given id.'
            );
        }
        // user is super admin or admin who created the burger
        await validatePermissions(context, ['admin', 'super admin'], true, updatedItem);
        // there's no burger with given name, description or ingredients
        validateUniqueness(otherItems, name, description, ingredients);
        // at least one change has been made to the burger
        const isThereDifference = updatedItem.name !== name.trim() ||
            updatedItem.description !== description.trim() ||
            updatedItem.ingredients.join('') !== ingredients.join('')
        if (!isThereDifference) {
            throw new functions.https.HttpsError(
                'failed-precondition',
                'In order to update menu burger, first introduce some changes.'
            );
        }

        // optionally recalculate price
        let price = updatedItem.price;
        if ([...updatedItem.ingredients].sort().join('') !== [...ingredients].sort().join('')) {
            price = ingredients.reduce((price, ingredient) => (
                price + ingredientPricesData[ingredient]
            ), ingredientPricesData.bun);
        }
        // update burger
        const menuItemRef = menuItemsRef.doc(id);
        await menuItemRef.update({
            name: name.trim(),
            description: description.trim(),
            ingredients,
            price
        })
        return 'Burger successfully updated.'
    });

exports.removeFromMenu = functions.https
    .onCall(async (id, context) => {
        // user is authed
        validateAuthStatus(context);
        // burger id
        // is non-empty string
        validateString('Burger id', id);
        // is assigned to existing menu burger
        const menuItemsRef = admin.firestore().collection('menu');
        const [menuItem, menuItemRef] = await validateExistence(id, menuItemsRef, 'burger');
        // user is super admin or admin who created that existing burger
        await validatePermissions(context, ['admin', 'super admin'], true, menuItem.data());
        // delete burger from menu
        await menuItemRef.delete();
        return 'Burger successfully removed from the menu.'
    });