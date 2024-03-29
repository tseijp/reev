export interface Nested<Ret = unknown, Args extends any[] = any[]> {
        (key: string, ...args: Args): Ret
        has(key: string): boolean
        map: Map<string, Ret>
}

export type ExtractArgs<T extends object> = T[keyof T] extends (
        ...args: infer A
) => any
        ? A
        : any[]

export interface DurableState<
        T extends object,
        R = unknown,
        Args extends unknown[] = ExtractArgs<T>
> {
        <K = keyof T>(key?: K, ...args: Args): R
        (target?: T, ext?: T[keyof T], ...args: Args): R
}

export type MutableState<
        T extends object,
        Args extends unknown[] = ExtractArgs<T>
> = T & {
        <K extends keyof T>(key?: K, fun?: T[K]): MutableState<T, Args>
        (target?: T, ext?: any): MutableState<T, Args>
}

export default EventState

export type EventState<
        T extends object,
        Args extends unknown[] = ExtractArgs<T>
> = T & {
        (key?: keyof T, fun?: T[keyof T]): EventState<T, Args>
        (target?: Partial<T>): EventState<T, Args>
}

export type NestedFun<Ret, Args extends any[] = any[]> = Fun<
        [key: string, ...args: Args],
        Ret
>

export type DurableFun<
        T extends object,
        Args extends unknown[] = ExtractArgs<T> & any
> = Fun<[key: string, ...args: Args]>

export type EventFun<
        T extends object,
        Args extends unknown[] = ExtractArgs<T>
> = Fun<[...args: Args], EventState<T>>

export type Fun<
        Args extends unknown[] = unknown[],
        Ret extends unknown = unknown
> = (...args: Args) => Ret

export type OverloadedArgs<T extends (...args: any[]) => unknown> = T extends {
        (...args: infer A1): any
        (...args: infer A2): any
}
        ? A1 | A2
        : Parameters<T>

export type DurableArgs<T extends object> = OverloadedArgs<DurableState<T>>

export type MutableArgs<T extends object> = OverloadedArgs<MutableState<T>>

export type EventArgs<T extends object> = OverloadedArgs<
        DurableState<{
                [key in keyof T]?: [EventFun<T>]
        }>
>

export type RefEvent<T extends object, Target = unknown> = EventState<
        T & {
                ref: (target: Target) => void
                mount: (target: Target) => void
                clean: (target: Target) => void
                target: Target
        }
>
