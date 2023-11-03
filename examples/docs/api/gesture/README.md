# gesture event

## React Hooks

| Hooks                   | Description                                |
| :---------------------- | :----------------------------------------- |
| [`useDrag`](./drag)     | Handles the drag gesture                   |
| [`useHover`](./hover)   | Handles mouse enter and mouse leave events |
| [`useKey`](./key)       | Handles key down and key up events         |
| [`usePinch`](./pinch)   | Handles the pinch gesture                  |
| [`useMove`](./move)     | Handles mouse move events                  |
| [`useResize`](./resize) | Handles components resize events           |
| [`useScroll`](./scroll) | Handles scroll events                      |
| [`useWheel`](./wheel)   | Handles wheel events                       |

### Usage

```tsx
const { ref } = useDrag((state) => doSomethingWith(state))

<div ref={ref} />
```
