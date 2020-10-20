import React from 'react';
import styles from './Input.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import icons from '../../../shared/icons';

const Input = ({
    elementType,
    elementConfig,
    elementLabel,
    elementPrefix,
    value,
    valueUnit,
    changed,
    valid,
    validation,
    touched
}) => {
    let inputElement;
    switch (elementType) {
        case ('input'):
            inputElement = (
                <>
                    {
                        elementPrefix ? (
                            <div className={styles.prefix}>
                                <FontAwesomeIcon
                                    icon={icons[`fa${elementPrefix}`]}
                                />
                            </div>
                        ) : null
                    }
                    <div className={styles.input}>
                        <input
                            className={styles.inputValue}
                            {...elementConfig}
                            value={value}
                            onChange={changed}
                            autoComplete='off'
                        />
                        {
                            valueUnit ? (
                                <span className={styles.inputUnit}>{valueUnit}</span>
                            ) : null
                        }
                        {
                            elementConfig.type === 'checkbox' ? (
                                <span className={styles.helper}></span>
                            ) : null
                        }
                    </div>
                </>
            );
            break;
        default:
            return 'Unhandled element type.'

    }
    let errorMessage = null;
    if (!valid && touched) errorMessage = (
        <span className={`${styles.errorMessage} danger`}>
            {validation.errorMessage}
        </span>
    )
    const isAlphanumeric = ['text', 'number', 'email', 'password'].includes(elementConfig.type);
    const isAlphanumericOrDate = isAlphanumeric || elementConfig.type === 'date';
    const inputWithLabelClassNames = [];
    if (isAlphanumericOrDate) {
        inputWithLabelClassNames.push(styles.alphanumOrDate)
    }
    if (elementConfig.type === 'checkbox') {
        inputWithLabelClassNames.push(styles.checkbox)
    }
    if (isAlphanumericOrDate && elementPrefix) {
        inputWithLabelClassNames.push(styles.withPrefix)
    }
    if (!elementConfig.placeholder && isAlphanumeric) {
        inputWithLabelClassNames.push(styles.withJumpingLabel)
    }
    if (value && isAlphanumericOrDate) {
        inputWithLabelClassNames.push(styles.filled)
    }
    if (!valid && touched) {
        inputWithLabelClassNames.push(styles.invalid)
    }
    return (
        <div className={styles.wrapper}>
            <div className={inputWithLabelClassNames.join(' ')}>
                <label htmlFor={elementConfig.id} className={styles.label}>
                    <span className={styles.labelValue}>
                        {elementLabel}
                    </span>
                </label>
                {inputElement}
            </div>
            {errorMessage}
        </div>
    );
}

export default Input;