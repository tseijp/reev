# Core API

## mutable

```ts
import { durable } from 'reev/src'

const click = () => {} // do something when window will be clicked
const memo = mutable({ click }) // register click event
// or memo = mutable("click", click)

window.addEventListener('click', memo.click)
memo({ click: () => {} }) // update click function without re-register
```

## event

```ts
import { event } from 'reev/src'

const click = () => {} // do something when window will be clicked
const e = event({ click }) // register click event
// or e = event("click", click)

window.addEventListener('click', e.click)
e({ click: () => {} }) // register new event
```
