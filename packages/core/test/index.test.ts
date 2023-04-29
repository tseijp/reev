import { event, nested, durable, mutable } from '../index';

describe('core', () => {
        it('should work', () => {
                expect(true).toBeTruthy();
        });
        const _ = Symbol();
        it('nested', () => {
                const memo = nested<Symbol, [string]>((_dummy) => _);
                expect(memo('_', 'dummy')).toBe(_);
        });
        it('durable', () => {
                const memo = durable<{ _: Symbol }>((key, arg) => {
                        expect(key).toBe('_');
                        expect(arg).toBe(_);
                });
                memo('_', _);
                memo({ _ });
        });
        it('mutable', () => {
                const memo = mutable<{ _: (e: Symbol) => void }>();
                // !!b!!
                memo('_', (arg) => expect(arg).toBe(_));
                memo.click(_);
        });
        it('event', () => {
                const anEvent = event<{
                        onMount: (_: Symbol) => void;
                        onClean: (_: Symbol) => void;
                }>({
                        onMount(arg) {
                                expect(arg).toBe(_);
                        },
                });
                // @TODO fix
                anEvent.mount('onClean', (...args) => {
                        expect(args).toEqual([_]);
                });
                // !!e!!
                // anEvent.i = 1;
                anEvent('onMount', _);
                anEvent('onClean', _);
        });
});
