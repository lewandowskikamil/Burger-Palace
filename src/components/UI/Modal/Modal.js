import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './Modal.module.css';
import Backdrop from '../Backdrop/Backdrop';

const modalVariants = {
    hidden: {
        x: '-50%',
        opacity: 0,
        y: '-100vh'
    },
    visible: {
        x: '-50%',
        opacity: 1,
        y: '-50%'
    }
}

const Modal = ({ children, isShowed, closeModal }) => {
    return (
        <>
            <Backdrop isShowed={isShowed} clicked={closeModal} />
            <AnimatePresence>
                {isShowed && <motion.div
                    key='modal'
                    className={styles.modal}
                    variants={modalVariants}
                    initial='hidden'
                    animate='visible'
                    exit='hidden'
                >
                    {children}
                </motion.div>}
            </AnimatePresence>
        </>
    );
}
export default Modal;