import React from 'react';
import styles from './OrderTable.module.css'
const OrderTable = ({ orders }) => {
    const displayedOrders = (
        orders
            .reverse()
            .map(({ id, ingredients, price, orderDate }) => (
                <tr key={id}>
                    <td>{new Date(+orderDate).toLocaleDateString()}</td>
                    <td>{(+price).toFixed(2)}</td>
                    {Object.keys(ingredients).map(ingrKey => (
                        <td key={ingrKey}>{ingredients[ingrKey]}</td>
                    ))}
                </tr>
            )))
    return (
        <table className={styles.orderTable}>
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Price</th>
                    <th>Bacon</th>
                    <th>Cheese</th>
                    <th>Meat</th>
                    <th>Salad</th>
                </tr>
            </thead>
            <tbody>
                {displayedOrders}
            </tbody>
        </table>
    )

}

export default OrderTable;