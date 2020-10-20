import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './Backdrop.module.css';
import { fadeVariants, variantsProps } from '../../../shared/utility';

const Backdrop = ({ isShowed, clicked }) => {
    return (
        <AnimatePresence>
            {isShowed && <motion.div
                key='backdrop'
                variants={fadeVariants}
                {...variantsProps}
                className={styles.backdrop}
                onClick={clicked}
            ></motion.div>}
        </AnimatePresence>
    );
}

export default Backdrop;