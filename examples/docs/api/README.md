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

window.addEventListener('click', e.on('click'))
// or
window.removeEventListener('click', e.on('click'))

// register and unregister event
e.mount({ click: () => {} })
e.clean({ click })
```

## React

### useMutable

```tsx
import { useMutable } from 'reev/react'

const [i, set] = useState(0)
const memo = useMutable({ click: () => set(i++) })

<div onClick={memo.click}>{i}</div>
```

### useEvent

```tsx
import { useEvent } from 'reev/react'

const e = useEvent({
        mount() {}, // do something when component did mount
        clean() {}, // do something when component did unmount
        click() {}, // do something when component will be clicked
})

<div onClick={e.on('click')} />
```

### useEventRef

```tsx
const e = useEventRef({
        mount() {}, // do something when component did mount
        clean() {}, // do something when component did unmount
        click() {}, // do something when component will be clicked
})

<div onClick={e.on('click')} ref={e.on('ref')} />
```
