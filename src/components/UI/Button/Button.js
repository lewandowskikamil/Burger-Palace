import React, { useState, useRef, useEffect } from 'react';
import styles from './Button.module.css';

const Button = ({
    children,
    clicked,
    disabled,
    circular,
    danger,
    success,
    secondary,
    dark,
    gradient,
    noMarginTop
}) => {
    const btnRef = useRef(null);
    const [wave, setWave] = useState(null);
    const btnClickHandler = e => {
        const { left: btnLeftOffset, top: btnTopOffset } = btnRef.current.getBoundingClientRect();
        const waveLeft = e.clientX - btnLeftOffset;
        const waveTop = e.clientY - btnTopOffset;
        setWave({
            left: waveLeft,
            top: waveTop,
            show: false,
            animationCompleted: false
        })
        clicked && clicked();
    }
    const btnClasses = [styles.btn];

    if (danger) btnClasses.push(styles.danger);
    else if (success) btnClasses.push(styles.success);
    else if (secondary) btnClasses.push(styles.secondary);
    else if (dark) btnClasses.push(styles.dark);
    else if (gradient) btnClasses.push(styles.gradient);
    if (disabled) btnClasses.push(styles.disabled);
    if (circular) btnClasses.push(styles.circular);
    if (noMarginTop) btnClasses.push(styles.noMarginTop);
    const childrenWithWave = (
        <>
            {!!wave && wave.show && !wave.completed && <span
                key={wave.left * Math.random() * Math.random()}
                className={styles.wave}
                style={{
                    left: wave.left + 'px',
                    top: wave.top + 'px',
                }}
                onAnimationEnd={() => setWave(prevState => ({ ...prevState, completed: true }))}
            ></span>}
            {children}
        </>
    )
    useEffect(() => {
        if (wave && !wave.show) setWave(prevState => ({ ...prevState, show: true }));
    }, [wave])
    return (
        <button
            ref={btnRef}
            className={btnClasses.join(' ')}
            onClick={btnClickHandler}
            disabled={!!disabled}
        >
            {childrenWithWave}
        </button>
    );
}

export default React.memo(Button);