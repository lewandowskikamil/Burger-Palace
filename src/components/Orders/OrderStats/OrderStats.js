import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import styles from './OrderStats.module.css';
import PieChart from '../../UI/PieChart/PieChart';
import icons from '../../../shared/icons'
import IconHeading from '../../UI/IconHeading/IconHeading';
import Card from '../../UI/Card/Card';
import { translateXTransition, variantsProps } from '../../../shared/utility';


const pieChartVariants = {
    hidden: i => ({
        opacity: 0,
        x: i % 2 ? '100vw' : '-100vw'
    }),
    visible: i => ({
        opacity: 1,
        x: 0,
        transition: {
            delay: 1.2 + i * 0.3,
            ...translateXTransition
        }
    })
}
const overallStatsVariants = {
    hidden: {
        opacity: 0,
        x: '-100vw'
    },
    visible: {
        opacity: 1,
        x: 0,
        transition: {
            delay: 1.2,
            ...translateXTransition
        }
    }
}

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
    filteredOrders
}) => {
    useEffect(() => {
        if (!filteredOrders.length) return;
        calculateOrdersStats()
    }, [filteredOrders, calculateOrdersStats])

    const chartsData = [
        {
            data: burgersContribution,
            title: 'Burgers contribution',
            colours: "schemeTableau10",
            decimals: 0
        },
        {
            data: allBurgers,
            title: 'Average burger ingredients portions',
            colours: "schemeTableau10",
            decimals: 2
        },
        {
            data: customBurgers,
            title: 'Average custom burger ingredients portions',
            colours: "schemeTableau10",
            decimals: 2
        },

    ];
    const pieCharts = chartsData
        .map((item, index) => {
            const chartData = Object.keys(item.data)
                .map(key => {
                    const value = Number(item.data[key].toFixed(2));
                    const splittedKey = key.split(/(?=[A-Z])/);
                    let legendName;
                    if (!index) legendName = splittedKey
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
        .map(({ title, data, colours, decimals }, index) => (
            data.length ? (
                <motion.div
                    key={title}
                    variants={pieChartVariants}
                    custom={index + 1}
                    {...variantsProps}
                    className={styles.chartWrapper}
                >
                    <PieChart
                        title={title}
                        data={data}
                        pieRadius={150}
                        chartPadding={5}
                        legendVerticalOffset={30}
                        legendHorizontalOffset={10}
                        colours={colours}
                        decimals={decimals}
                    />
                </motion.div>
            ) : null
        ));

    return (
        <div className={styles.orderStats}>
            <motion.div
                className={styles.overallStatsWrapper}
                variants={overallStatsVariants}
                {...variantsProps}
            >
                <Card
                    destination='stats'
                >
                    <div className={styles.innerWrapper}>
                        <IconHeading icon={icons.faChartLine} />
                        <p key='ordersNumber'>
                            {filteredOrders.length > 1 ? (
                                `There are ${filteredOrders.length} orders meeting above criteria. Based on them:`
                            ) : 'There is only one order meeting above criteria.'}
                        </p>
                        <p key='averageBurgerCost'>
                            Your average burger costs: <span
                                className='dark bold'
                            >
                                {avgBurgerPrice && avgBurgerPrice.toFixed(2)} PLN
                        </span>
                        </p>
                        <p key='averageOrder'>
                            ...and your order on average:
                        </p>
                        <p key='averageOrderCost'>
                            costs: <span
                                className='dark bold'
                            >
                                {avgOrderPrice && avgOrderPrice.toFixed(2)} PLN
                        </span>
                        </p>
                        <p key='averageOrderBurgersAmount'>
                            consists of: <span
                                className='dark bold'
                            >
                                {avgBurgersAmount && avgBurgersAmount.toFixed(2)}
                            </span> burgers
                        </p>
                    </div>
                </Card>
            </motion.div>
            {pieCharts}
        </div>
    );
}

export default OrderStats;