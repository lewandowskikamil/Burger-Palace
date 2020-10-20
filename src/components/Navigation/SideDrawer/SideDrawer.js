import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import NavigationItems from '../NavigationItems/NavigationItems';
import styles from './SideDrawer.module.css';
import Backdrop from '../../UI/Backdrop/Backdrop';
import Arrow from '../Arrow/Arrow';
const sideDrawerVariants = {
    hidden: {
        opacity: 0,
        x: '-100vw',
        transition: {
            type: 'tween'
        }
    },
    visible: {
        opacity: 1,
        x: 0,
        transition: {
            type: 'tween'
        }
    }
}
const SideDrawer = ({ close, isShowed, isAuthed, userRole }) => {
    return (
        <>
            <Backdrop isShowed={isShowed} clicked={close} />
            <AnimatePresence>
                {isShowed && <motion.div
                    key='sideDrawer'
                    className={styles.sideDrawer}
                    variants={sideDrawerVariants}
                    initial='hidden'
                    animate='visible'
                    exit='hidden'
                >
                    <div className={styles.arrow}>
                        <Arrow
                            clicked={close}
                            direction='Left'
                        />
                    </div>
                    <nav>
                        <NavigationItems
                            isAuthed={isAuthed}
                            userRole={userRole}
                            mobile
                            clicked={close}
                        />
                    </nav>
                </motion.div>}
            </AnimatePresence>
        </>
    );
}

export default SideDrawer;