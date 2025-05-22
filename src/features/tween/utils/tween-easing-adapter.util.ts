export const tweenEasingAdapter = (easingName: string): string => {
    const initialChar = easingName.charAt(0);
    if (/[A-Z]/.test(initialChar)) {
        easingName = easingName.replace(initialChar, initialChar.toLowerCase());
        const arr = easingName.split('-');
        if (arr.length === 2) {
            const str0 = arr[0];
            if (str0 === 'linear') {
                easingName = 'linear';
            } else {
                const str1 = arr[1];
                switch (str0) {
                    case 'quadratic':
                        easingName = `quad${str1}`;
                        break;
                    case 'quartic':
                        easingName = `quart${str1}`;
                        break;
                    case 'quintic':
                        easingName = `quint${str1}`;
                        break;
                    case 'sinusoidal':
                        easingName = `sine${str1}`;
                        break;
                    case 'exponential':
                        easingName = `expo${str1}`;
                        break;
                    case 'circular':
                        easingName = `circ${str1}`;
                        break;
                    default:
                        easingName = str0 + str1;
                        break;
                }
            }
        }
    }
    return easingName;
};
