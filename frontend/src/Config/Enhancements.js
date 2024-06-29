export const debounce = (func, delay) => {
    let timeoutId;
    return function (...args) {
        const context = this;
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(() => {
            func.apply(context, args);
        }, delay);
    };
};

export const findTime = (inputDate) => {
    const date = new Date(inputDate);
    const options = {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
    };
    
    const timeString = new Intl.DateTimeFormat('en-US', options).format(date);
    console.log(timeString);
    return timeString
} 




