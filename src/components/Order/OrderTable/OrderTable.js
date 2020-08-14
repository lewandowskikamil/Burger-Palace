import React from 'react';
import styles from './OrderTable.module.css'
const OrderTable = ({ orders }) => {
    const displayedOrders = (
        orders
            .sort((a, b) => b.orderTimestamp - a.orderTimestamp)
            .map(({
                cartItems,
                totalPrice,
                orderTimestamp
            }) => {
                const orderRows = cartItems.map((
                    {
                        id,
                        name,
                        ingredients,
                        amount,
                        price
                    },
                    index,
                    array
                ) => {
                    const cartItemDetails = (
                        <>
                            <td>{name}</td>
                            {
                                Object.keys(ingredients).map(ingrKey => (
                                    <td key={ingrKey}>{ingredients[ingrKey]}</td>
                                ))
                            }
                            <td>{amount}</td>
                            <td>{price.toFixed(2)}</td>
                        </>
                    )
                    const orderDate=new Date(orderTimestamp).toLocaleDateString();
                    if (array.length === 1) return (
                        <tr key={id}>
                            <td>{orderDate}</td>
                            <td>{totalPrice.toFixed(2)}</td>
                            {cartItemDetails}
                        </tr>
                    )
                    if (index === 0) return (
                        <tr key={id}>
                            <td rowSpan={array.length}>{orderDate}</td>
                            <td rowSpan={array.length}>{totalPrice.toFixed(2)}</td>
                            {cartItemDetails}
                        </tr>
                    )
                    return (
                        <tr key={id}>
                            {cartItemDetails}
                        </tr>
                    )
                })
                return orderRows
            }))

    return (
        <table className={styles.orderTable}>
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Total price</th>
                    <th>Burger name</th>
                    <th>Bacon</th>
                    <th>Cheese</th>
                    <th>Meat</th>
                    <th>Salad</th>
                    <th>Amount</th>
                    <th>Price</th>

                </tr>
            </thead>
            <tbody>
                {displayedOrders}
            </tbody>
        </table>
    )

}

export default OrderTable;