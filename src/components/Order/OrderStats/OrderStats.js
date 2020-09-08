import React, { useEffect } from 'react';
import styles from './OrderStats.module.css';
import PieChart from '../../UI/PieChart/PieChart';

const OrderStats = ({
    ordersStats: {
        avgBurgersAmount,
        avgOrderPrice
    },
    ordersBurgersStats: {
        avgBurgerPrice,
        avgIngredientsAmount: {
            allBurgers,
            customBurgers
        },
        burgersContribution
    },
    calculateOrdersStats,
    filteredOrders,
    areStatsCalculated
}) => {
    useEffect(() => {
        if (!filteredOrders.length) return;
        calculateOrdersStats()
    }, [filteredOrders, calculateOrdersStats])
    if (!filteredOrders.length) return null;

    const chartsData = [
        {
            data: allBurgers,
            title: 'Average burger ingredients',
            colours: "schemeTableau10",
            decimals: 2
        },
        {
            data: customBurgers,
            title: 'Average custom burger ingredients',
            colours: "schemeTableau10",
            decimals: 2
        },
        {
            data: burgersContribution,
            title: 'Burgers contribution',
            colours: "schemeTableau10",
            decimals: 0
        },
    ];
    const pieCharts = chartsData
        .map((item, index) => {
            const chartData = Object.keys(item.data)
                .map(key => {
                    const value = Number(item.data[key].toFixed(2));
                    const splittedKey = key.split(/(?=[A-Z])/);
                    let legendName;
                    if (index === 2) legendName = splittedKey
                        .map((word, index) => {
                            if (index) return word;
                            return word.charAt(0).toUpperCase() + word.slice(1);
                        })
                        .join(' ');
                    else legendName = splittedKey[1].toLowerCase();
                    return {
                        value,
                        legendName
                    }
                })
            return {
                title: item.title,
                colours: item.colours,
                decimals: item.decimals,
                data: chartData
            }
        })
        .map(({ title, data, colours, decimals }) => (
            data.length ? (
                <PieChart
                    key={title}
                    title={title}
                    data={data}
                    pieRadius={150}
                    chartPadding={5}
                    legendVerticalOffset={30}
                    legendHorizontalOffset={10}
                    colours={colours}
                    decimals={decimals}
                />
            ) : <p>There are no custom burgers in filtered orders.</p>
        ));

    return (
        <div className={styles.orderStats}>
            <h2>Stats</h2>
            <p>Based on displayed orders, your burger on average:</p>
            <p>costs: <span><strong>{avgBurgerPrice && avgBurgerPrice.toFixed(2)}</strong></span></p>
            <p>...and your order on average:</p>
            <p>costs: <span><strong>{avgOrderPrice && avgOrderPrice.toFixed(2)}</strong></span></p>
            <p>consists of: <span><strong>{avgBurgersAmount && avgBurgersAmount.toFixed(2)}</strong></span> burgers</p>
            <h3>Charts</h3>
            {pieCharts}
        </div>
    );
}

export default OrderStats;