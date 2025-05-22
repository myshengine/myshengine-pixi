export type FlagExcludedType<Base, Type> = { [Key in keyof Base]: Base[Key] extends Type ? never : Key };

export type AllowedNames<Base, Type> = FlagExcludedType<Base, Type>[keyof Base];

export type KeyPartial<T, K extends keyof T> = { [P in K]?: T[P] };

export type OmitType<Base, Type> = KeyPartial<Base, AllowedNames<Base, Type>>;

export type ConstructorType<T> = OmitType<T, Function>;

export type TweenEasing =
    | 'linear'
    | 'smooth'
    | 'fade'
    | 'constant'
    | 'quadIn'
    | 'quadOut'
    | 'quadInOut'
    | 'quadOutIn'
    | 'cubicIn'
    | 'cubicOut'
    | 'cubicInOut'
    | 'cubicOutIn'
    | 'quartIn'
    | 'quartOut'
    | 'quartInOut'
    | 'quartOutIn'
    | 'quintIn'
    | 'quintOut'
    | 'quintInOut'
    | 'quintOutIn'
    | 'sineIn'
    | 'sineOut'
    | 'sineInOut'
    | 'sineOutIn'
    | 'expoIn'
    | 'expoOut'
    | 'expoInOut'
    | 'expoOutIn'
    | 'circIn'
    | 'circOut'
    | 'circInOut'
    | 'circOutIn'
    | 'elasticIn'
    | 'elasticOut'
    | 'elasticInOut'
    | 'elasticOutIn'
    | 'backIn'
    | 'backOut'
    | 'backInOut'
    | 'backOutIn'
    | 'bounceIn'
    | 'bounceOut'
    | 'bounceInOut'
    | 'bounceOutIn';
