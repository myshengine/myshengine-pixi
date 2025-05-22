export const constant = (): number => 0;

export const linear = (k: number): number => k;

export const quadIn = (k: number): number => k * k;

export const quadOut = (k: number): number => k * (2 - k);

export const quadInOut = (k: number): number => {
    k *= 2;
    if (k < 1) {
        return 0.5 * k * k;
    }
    return -0.5 * (--k * (k - 2) - 1);
};

export const cubicIn = (k: number): number => k * k * k;

export const cubicOut = (k: number): number => --k * k * k + 1;

export const cubicInOut = (k: number): number => {
    k *= 2;
    if (k < 1) {
        return 0.5 * k * k * k;
    }
    return 0.5 * ((k -= 2) * k * k + 2);
};

export const quartIn = (k: number): number => k * k * k * k;

export const quartOut = (k: number): number => 1 - --k * k * k * k;

export const quartInOut = (k: number): number => {
    k *= 2;
    if (k < 1) {
        return 0.5 * k * k * k * k;
    }
    return -0.5 * ((k -= 2) * k * k * k - 2);
};

export const quintIn = (k: number): number => k * k * k * k * k;

export const quintOut = (k: number): number => --k * k * k * k * k + 1;

export const quintInOut = (k: number): number => {
    k *= 2;
    if (k < 1) {
        return 0.5 * k * k * k * k * k;
    }
    return 0.5 * ((k -= 2) * k * k * k * k + 2);
};

export const sineIn = (k: number): number => (k === 1 ? 1 : 1 - Math.cos((k * Math.PI) / 2));

export const sineOut = (k: number): number => Math.sin((k * Math.PI) / 2);

export const sineInOut = (k: number): number => 0.5 * (1 - Math.cos(Math.PI * k));

export const expoIn = (k: number): number => (k === 0 ? 0 : Math.pow(1024, k - 1));

export const expoOut = (k: number): number => (k === 1 ? 1 : 1 - Math.pow(2, -10 * k));

export const expoInOut = (k: number): number => {
    if (k === 0) {
        return 0;
    }
    if (k === 1) {
        return 1;
    }
    k *= 2;
    if (k < 1) {
        return 0.5 * Math.pow(1024, k - 1);
    }
    return 0.5 * (-Math.pow(2, -10 * (k - 1)) + 2);
};

export const circIn = (k: number): number => 1 - Math.sqrt(1 - k * k);

export const circOut = (k: number): number => Math.sqrt(1 - --k * k);

export const circInOut = (k: number): number => {
    k *= 2;
    if (k < 1) {
        return -0.5 * (Math.sqrt(1 - k * k) - 1);
    }
    return 0.5 * (Math.sqrt(1 - (k -= 2) * k) + 1);
};

export const elasticIn = (k: number): number => {
    let s;
    let a = 0.1;
    const p = 0.4;
    if (k === 0) {
        return 0;
    }
    if (k === 1) {
        return 1;
    }
    if (!a || a < 1) {
        a = 1;
        s = p / 4;
    } else {
        s = (p * Math.asin(1 / a)) / (2 * Math.PI);
    }
    return -(a * Math.pow(2, 10 * (k -= 1)) * Math.sin(((k - s) * (2 * Math.PI)) / p));
};

export const elasticOut = (k: number): number => {
    let s;
    let a = 0.1;
    const p = 0.4;
    if (k === 0) {
        return 0;
    }
    if (k === 1) {
        return 1;
    }
    if (!a || a < 1) {
        a = 1;
        s = p / 4;
    } else {
        s = (p * Math.asin(1 / a)) / (2 * Math.PI);
    }
    return a * Math.pow(2, -10 * k) * Math.sin(((k - s) * (2 * Math.PI)) / p) + 1;
};

export const elasticInOut = (k: number): number => {
    let s;
    let a = 0.1;
    const p = 0.4;
    if (k === 0) {
        return 0;
    }
    if (k === 1) {
        return 1;
    }
    if (!a || a < 1) {
        a = 1;
        s = p / 4;
    } else {
        s = (p * Math.asin(1 / a)) / (2 * Math.PI);
    }
    k *= 2;
    if (k < 1) {
        return -0.5 * (a * Math.pow(2, 10 * (k -= 1)) * Math.sin(((k - s) * (2 * Math.PI)) / p));
    }
    return a * Math.pow(2, -10 * (k -= 1)) * Math.sin(((k - s) * (2 * Math.PI)) / p) * 0.5 + 1;
};

export const backIn = (k: number): number => (k === 1 ? 1 : k * k * ((1.70158 + 1) * k - 1.70158));

export const backOut = (k: number): number => (k === 0 ? 0 : --k * k * ((1.70158 + 1) * k + 1.70158) + 1);

export const backInOut = (k: number): number => {
    const s = 1.70158 * 1.525;
    k *= 2;
    if (k < 1) {
        return 0.5 * (k * k * ((s + 1) * k - s));
    }
    return 0.5 * ((k -= 2) * k * ((s + 1) * k + s) + 2);
};

export const bounceIn = (k: number): number => 1 - bounceOut(1 - k);

export const bounceOut = (k: number): number => {
    if (k < 1 / 2.75) {
        return 7.5625 * k * k;
    } else if (k < 2 / 2.75) {
        return 7.5625 * (k -= 1.5 / 2.75) * k + 0.75;
    } else if (k < 2.5 / 2.75) {
        return 7.5625 * (k -= 2.25 / 2.75) * k + 0.9375;
    } else {
        return 7.5625 * (k -= 2.625 / 2.75) * k + 0.984375;
    }
};

export const bounceInOut = (k: number): number => (k < 0.5 ? bounceIn(k * 2) * 0.5 : bounceOut(k * 2 - 1) * 0.5 + 0.5);

export const smooth = (k: number): number => (k <= 0 ? 0 : k * k * (3 - 2 * k));

export const fade = (k: number): number => (k <= 0 ? 0 : k * k * k * (k * (k * 6 - 15) + 10));

const _makeOutIn = (fnIn: (k: number) => number, fnOut: (k: number) => number): ((k: number) => number) => {
    return (k: number): number => {
        if (k < 0.5) {
            return fnOut(k * 2) / 2;
        }
        return fnIn(2 * k - 1) / 2 + 0.5;
    };
};

export const quadOutIn = _makeOutIn(quadIn, quadOut);

export const cubicOutIn = _makeOutIn(cubicIn, cubicOut);

export const quartOutIn = _makeOutIn(quartIn, quartOut);

export const quintOutIn = _makeOutIn(quintIn, quintOut);

export const sineOutIn = _makeOutIn(sineIn, sineOut);

export const expoOutIn = _makeOutIn(expoIn, expoOut);

export const circOutIn = _makeOutIn(circIn, circOut);

export const elasticOutIn = _makeOutIn(elasticIn, elasticOut);

export const backOutIn = _makeOutIn(backIn, backOut);

export const bounceOutIn = _makeOutIn(bounceIn, bounceOut);
