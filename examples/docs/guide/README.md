# guide

## React

| Hooks       | Description                                |
| :---------- | :----------------------------------------- |
| `useDrag`   | Handles the drag gesture                   |
| `useFile`   | Handles file select events                 |
| `useDrop`   | Handles file drop and select events        |
| `useHover`  | Handles mouse enter and mouse leave events |
| `useMove`   | Handles mouse move events                  |
| `useScroll` | Handles scroll events                      |
| `useWheel`  | Handles wheel events                       |
| `usePinch`  | Handles the pinch gesture                  |

### Usage

```tsx
const { ref } = useDrag((state) => doSomethingWith(state))

<div ref={ref} />
```
