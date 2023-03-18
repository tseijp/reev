# Basic API

## core

### event

```ts
import { event } from "reev"

const click = () => {} // do something

const e = event({ click }) // register event
// or e = event("click", click)

window.addEventListener("click", e.on("click"))
// or
window.removeEventListener("click", e.on("click"))
```

## React

### useMutable

```tsx
import { useMutable } from "reev/react"

const [i, set] = useState(0)
const memo = useMutable({ click: () => set(i++) })

return <div onClick={memo["click"]}>{ i }</div>
```

### useEvent

```tsx
import { useEvent } from "reev/react"

useEvent({
  mount() {}, // do something when component did mount
  clean() {}, // do something when component did unmount
})

return <div />
```

### useEventRef

```tsx
const ref = useEventRef({
  mount() {}, // do something when component did mount
  clean() {}, // do something when component did unmount
})

return <div ref={ref} />
```