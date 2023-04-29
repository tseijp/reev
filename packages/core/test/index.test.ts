import { event, nested, durable, mutable } from '../index'

describe('core', () => {
        it('should work', () => {
                expect(true).toBeTruthy()
        })
        const _ = Symbol()
        it('nested', () => {
                const memo = nested<Symbol, [string]>((_dummy) => _)
                expect(memo('_', 'dummy')).toBe(_)
        })
        it('durable', () => {
                const memo = durable<{ _: Symbol }>((key, arg) => {
                        expect(key).toBe('_')
                        expect(arg).toBe(_)
                })
                memo('_', _)
                memo({ _ })
        })
        it('mutable', () => {
                const memo = mutable<{ _: (e: Symbol) => void }>()
                memo('_', (arg) => expect(arg).toBe(_))
                memo.click(_)
        })
        it('event', () => {
                const e = event<{
                        i: number
                        onMount: (_: Symbol) => void
                        onClean: (_: Symbol) => void
                }>()
                e.mount({
                        onMount(arg) {
                                expect(arg).toBe(_)
                        },
                })
                e.mount('onClean', (arg) => {
                        expect(arg).toEqual(_)
                })
                e.i = 1
                e('onMount', _)
                e('onClean', _)
        })
})
