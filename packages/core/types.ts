export default EventState;

export interface Nested<Ret = unknown, Args extends any[] = any[]> {
        (key: string, ...args: Args): Ret;
        has(key: string): boolean;
        map: Map<string, Ret>;
}

export type ExtractArgs<T extends object> = T[keyof T] extends (
        ...args: infer A
) => any
        ? A
        : any[];

export interface DurableState<
        T extends object,
        R = unknown,
        Args extends any[] = ExtractArgs<T>
> {
        <K = keyof T>(key: K, ...args: Args): R;
        (target: T, ext?: T[keyof T], ...args: Args): R;
}

export interface MutableState<
        T extends object,
        Args extends any[] = ExtractArgs<T>
> {
        <K extends keyof T>(key: K, fun: T[K]): MutableState<T, Args>;
        (target: T): MutableState<T, Args>;
        [key: string]: (...args: Args) => any;
}

export interface EventState<
        T extends object,
        Args extends any[] = ExtractArgs<T>
> {
        <K = keyof T>(key: K, ...args: Args): EventState<T, Args>;
        (target: T, ...args: Args): EventState<T, Args>;
        mount: DurableState<{ [key in keyof T]: [EventFun<T>] }>;
        clean: DurableState<{ [key in keyof T]: [EventFun<T>] }>;
        on: Nested<Fun>;
}

export type NestedFun<Ret, Args extends any[] = any[]> = Fun<
        [key: string, ...args: Args],
        Ret
>;

export type DurableFun<
        T extends object,
        // @TODO fix
        Args extends any[] = ExtractArgs<T> & any
> = Fun<[key: string, ...args: Args]>;

export type EventFun<
        T extends object,
        Args extends any[] = ExtractArgs<T>
> = Fun<[...args: Args], EventState<T>>;

export type Fun<Args extends any[] = any[], Ret extends any = any> = (
        ...args: Args
) => Ret;

export type DurableArgs<T extends object> = Parameters<DurableState<T>>;

export type MutableArgs<T extends object> = Parameters<MutableState<T>>;

export type EventArgs<T extends object, Args extends any[] = ExtractArgs<T>> =
        | [key: keyof T, ...args: Args]
        | [target: Partial<T>, ...args: Args];
