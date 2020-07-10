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
        isValid = pattern.test(value) && isValid
    }

    if (rules.isNumeric) {
        const pattern = /^\d+$/;
        isValid = pattern.test(value) && isValid
    }

    return isValid
}
// how to share stateful logic - for instance inputHandler