# Basic API

## core

### mutable

```ts
import { durable } from 'reev'

const click = () => {} // do something

const memo = mutable({ click })
// or memo = mutable("click", click)

window.addEventListener('click', memo.click)
// or
window.removeEventListener('click', memo.click)

// update click function without re-register
memo({ click: () => {} })
```

### event

```ts
import { event } from 'reev'

const click = () => {} // do something

const e = event({ click }) // register event
// or e = event("click", click)

window.addEventListener('click', e.click)
// or
window.removeEventListener('click', e.click)

// register new event
e({ click: () => {} })
```

## React

### useMutable

```tsx
import { useMutable } from 'reev/react'

const [i, set] = useState(0)
const { click } = useMutable({ click: () => set(i++) })

<div onClick={click}>{i}</div>
```

### useEvent

```tsx
import { useEvent } from 'reev/react'

const [i, set] = useState(0)
const e = useEvent({ click: () => set(i++) })

e("click", () => {}) // register new function

<div onClick={e.click}>{i}</div>
```

### useEventRef

```tsx
const e = useEventRef({
        mount() {}, // do something when component did mount
        clean() {}, // do something when component did unmount
        click() {}, // do something when component will be clicked
})

<div ref={e.ref} onClick={e.click)} />
```
