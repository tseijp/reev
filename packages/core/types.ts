export default Event

export interface Event {
        (key: string, ...args: unknown[]): void
        mount(key: string, fun: EventFun): void
        clean(key: string, fun: EventFun): void
        mount(obj: Record<string, EventFun>): void
        clean(obj: Record<string, EventFun>): void
        on: Nested<EventFun>
}

export interface Nested<T = unknown> {
        (key: string, ...args: unknown[]): T
        has(key: string): boolean
        mount: Durable
        clean: Durable
}

export type Durable<T = unknown> = (fun: DurableFun, ret?: T) => (
        target: string | Record<string, unknown>,
        ...args: unknown[]
) => T

export type Fun<
        Args extends unknown[] = unknown[],
        Ret extends unknown = unknown
> = (...args: Args) => Ret

export type EventFun = Fun<[ret: Event, ...args: unknown[]]>

export type DurableFun = Fun<[key: string, ...args: unknown[]]>
