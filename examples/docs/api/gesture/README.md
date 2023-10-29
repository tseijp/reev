# gesture event

## React Hooks

| Hooks                   | Description                                |
| :---------------------- | :----------------------------------------- |
| [`useDrag`](./drag)     | Handles the drag gesture                   |
| [`useDrop`](./drop)     | Handles file drop and select events        |
| [`useHover`](./hover)   | Handles mouse enter and mouse leave events |
| [`useMove`](./move)     | Handles mouse move events                  |
| [`useScroll`](./scroll) | Handles scroll events                      |
| [`useWheel`](./wheel)   | Handles wheel events                       |

### Usage

```tsx
const { ref } = useDrag((state) => doSomethingWith(state))

<div ref={ref} />
```
