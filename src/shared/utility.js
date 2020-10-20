export const updateObject = (oldObject, updatedProperties) => ({
    ...oldObject,
    ...updatedProperties
})
export const checkValidity = (value, rules) => {
    let isValid = true;
    if (!rules) return isValid;
    if (rules.required) {
        isValid = value.trim() !== '';
    }
    if (rules.minLength) {
        isValid = value.trim().length >= rules.minLength && isValid;
    }
    if (rules.maxLength) {
        isValid = value.trim().length <= rules.maxLength && isValid;
    }
    if (rules.isEmail) {
        const pattern = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
        isValid = pattern.test(value) && isValid;
    }

    if (rules.isNumeric) {
        const pattern = /^\d+$/;
        isValid = pattern.test(value) && isValid;
    }
    if (rules.isOptionalPrice) {
        const pattern = /^\d*(\.\d{0,2})?$/;
        isValid = ((pattern.test(value) && value > 0) || value === '') && isValid;
    }
    if (rules.isRequiredPrice) {
        const pattern = /^\d*(\.\d{0,2})?$/;
        isValid = pattern.test(value) && value > 0 && isValid;
    }

    return isValid
}

// framer motion

export const variantsProps = {
    initial: 'hidden',
    animate: 'visible',
    exit: 'exit'
}
export const translateYTransition = {
    type: "spring",
    damping: 10,
    stiffness: 150,
    mass: 0.3
}
export const translateXTransition = {
    type: "spring",
    damping: 10,
    stiffness: 150,
    mass: 0.25
}
export const containerVariants = {
    hidden: {
        opacity: 0,
        x: '100vw'
    },
    visible: {
        opacity: 1,
        x: 0,
        transition: {
            duration: 0.3,
            when: 'beforeChildren',
            staggerChildren: 0.3
        }
    },
    exit: {
        opacity: 0,
        x: '-100vw',
        transition: {
            duration: 0.3
        }
    }
}
export const fadeVariants = {
    hidden: {
        opacity: 0
    },
    visible: {
        opacity: 1,
        transition: {
            when: 'beforeChildren',
            staggerChildren: 0.3,
        }
    },
    exit: {
        opacity: 0,
    }
}
export const translateYVariants = {
    hidden: fromTop => ({
        opacity: 0,
        y: fromTop ? '-100vh' : '100vh'
    }),
    visible: {
        opacity: 1,
        y: 0,
        transition: translateYTransition
    },
    exit: fromTop => ({
        opacity: 0,
        y: fromTop ? '-100vh' : '100vh',
        transition: translateYTransition
    })
}
export const translateXVariants = {
    hidden: fromLeft => ({
        opacity: 0,
        x: fromLeft ? '-100vw' : '100vw',
    }),
    visible: {
        opacity: 1,
        x: 0,
        transition: translateXTransition
    },
    exit: fromLeft => ({
        opacity: 0,
        x: fromLeft ? '-100vw' : '100vw',
        transition: translateXTransition
    })
}
export const scaleVariants = {
    hidden: {
        opacity: 0,
        scale: 0
    },
    visible: {
        opacity: 1,
        scale: 1
    }
}
export const scaleXVariants = {
    hidden: {
        opacity: 0,
        scaleX: 0
    },
    visible: {
        opacity: 1,
        scaleX: 1,
        transition: {
            when: 'beforeChildren'
        }
    }
}