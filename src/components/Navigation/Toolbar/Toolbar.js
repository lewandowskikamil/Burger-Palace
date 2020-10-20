import React from 'react';
import { motion } from 'framer-motion';
import styles from './Toolbar.module.css';
import Logo from '../../Logo/Logo';
import NavigationItems from '../NavigationItems/NavigationItems';
import Bars from '../Bars/Bars';
import { variantsProps, translateYVariants } from '../../../shared/utility';

const Toolbar = ({ open, isAuthed, userRole }) => {
    return (
        <motion.header
            className={styles.toolbar}
            variants={translateYVariants}
            custom={true}
            {...variantsProps}
        >
            <Bars
                color='white'
                clicked={open}
            />
            <Logo />
            <nav>
                <NavigationItems
                    isAuthed={isAuthed}
                    userRole={userRole}
                />
            </nav>
        </motion.header>
    );
}

export default Toolbar;