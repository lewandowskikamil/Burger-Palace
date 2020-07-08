import React from 'react';
import styles from './Input.module.css'

const Input = ({
    elementType,
    elementConfig,
    elementLabel,
    value,
    changed,
    valid,
    validation,
    touched
}) => {
    let inputElement;
    switch (elementType) {
        case ('input'):
            inputElement = (
                <input
                    className={styles.inputElement}
                    {...elementConfig}
                    value={value}
                    onChange={changed}
                />
            );
            break;
        case ('textarea'):
            inputElement = (
                <textarea
                    className={styles.inputElement}
                    {...elementConfig}
                    value={value}
                    onChange={changed}
                />
            );
            break;
        case ('select'):
            inputElement = (
                <select
                    className={styles.inputElement}
                    id={elementConfig.id}
                    name={elementConfig.name}
                    value={value}
                    onChange={changed}
                >
                    {elementConfig.options.map(({ value, displayValue }) => (
                        <option key={value} value={value}>{displayValue}</option>
                    ))}
                </select>
            );
            break;
        default:
            inputElement = (
                <input
                    className={styles.inputElement}
                    {...elementConfig}
                    value={value}
                    onChange={changed}
                />
            );

    }
    let errorMessage = null;
    if (!valid && typeof (valid) === 'boolean' && touched) errorMessage = (
        <span className={styles.errorMessage}>{validation.errorMessage}</span>
    )
    return (
        <div className={styles.input}>
            <label htmlFor={elementConfig.id} className={styles.label}>
                {elementLabel}
            </label>
            {inputElement}
            {errorMessage}
        </div>
    );
}

export default Input;