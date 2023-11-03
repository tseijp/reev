# Core API

## mutable

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

## event

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
