import React from 'react';
import styles from './OrderTable.module.css'
const OrderTable = ({ filteredOrders, filteredOrdersBurgers }) => {
    if (!filteredOrders.length) return (
        <p>There are no matching orders.</p>
    )
    const allIngredients = filteredOrdersBurgers
        .reduce((ingrArray, { ingredients }) => ingrArray.concat(ingredients), []);
    const ingredientTypes = [...new Set(allIngredients)];
    const ordersWithBurgers = filteredOrders.map(order => ({
        ...order,
        orderBurgers: filteredOrdersBurgers.filter(burger => burger.orderId === order.id)
    }))
    const displayedOrders = (
        ordersWithBurgers
            .sort((a, b) => b.timestamp - a.timestamp)
            .map(({
                orderBurgers,
                orderPrice,
                timestamp
            }) => {
                const orderRows = orderBurgers.map((
                    {
                        id: burgerId,
                        name,
                        ingredients,
                        amount,
                        price
                    },
                    index,
                    array
                ) => {
                    const burgerDetails = (
                        <>
                            <td>{name}</td>
                            {
                                ingredientTypes.map(ingrType => (
                                    <td key={`${ingrType}_${burgerId}`}>
                                        {ingredients.filter(ingr => ingr === ingrType).length}
                                    </td>
                                ))
                            }
                            <td>{amount}</td>
                            <td>{price.toFixed(2)}</td>
                        </>
                    )
                    const orderDate = new Date(timestamp).toLocaleDateString();
                    if (array.length === 1) return (
                        <tr key={burgerId}>
                            <td>{orderDate}</td>
                            <td>{orderPrice.toFixed(2)}</td>
                            {burgerDetails}
                        </tr>
                    )
                    if (index === 0) return (
                        <tr key={burgerId}>
                            <td rowSpan={array.length}>{orderDate}</td>
                            <td rowSpan={array.length}>{orderPrice.toFixed(2)}</td>
                            {burgerDetails}
                        </tr>
                    )
                    return (
                        <tr key={burgerId}>
                            {burgerDetails}
                        </tr>
                    )
                })
                return orderRows
            }))

    return (
        <div
            style={{ justifyContent: 'center', display: 'flex' }}
        >
            <table className={styles.orderTable}>
                <thead>
                    <tr>
                        <th rowSpan={2}>Date</th>
                        <th rowSpan={2}>Total price</th>
                        <th rowSpan={2}>Burger name</th>
                        <th
                            colSpan={ingredientTypes.length}
                            style={{ textAlign: 'center' }}
                        >
                            Ingredients
                    </th>
                        <th rowSpan={2}>Amount</th>
                        <th rowSpan={2}>Price</th>
                    </tr>
                    <tr>
                        {ingredientTypes.map(ingrType => (
                            <th key={ingrType}>{ingrType}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {displayedOrders}
                </tbody>
            </table>
        </div>
    )

}

export default OrderTable;