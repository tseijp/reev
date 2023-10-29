# Core API for React

### useMutable

```tsx
import React from 'react'
import { useMutable } from 'reev/react'

const [i, set] = React.useState(0)
const { click } = useMutable({ click: () => set(i + 1) })

<div onClick={click}>{i}</div>
```

### useEvent

```tsx
import React from 'react'
import { useEvent } from 'reev/react'

const [i, set] = React.useState(0)
const e = useEvent({ click: () => set(i + 1) })

e("click", () => {}) // register new function

<div onClick={e.click}>{i}</div>
```

### useRefEvent

```tsx
const e = useRefEvent({
        mount() {}, // do something when component did mount
        clean() {}, // do something when component did unmount
        click() {}, // do something when component will be clicked
})

<div ref={e.ref} onClick={e.click)} />
```
