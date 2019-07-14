export const updateObject = (oldOBject, updatedProperties) => {
    return {
        ...oldOBject,
        ...updatedProperties
    }
}