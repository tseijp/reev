# reev 

[![npm](https://img.shields.io/npm/v/reev.svg)](https://www.npmjs.com/package/reev)
[![npm](https://img.shields.io/npm/dm/reev.svg)](https://www.npmjs.com/package/reev)
[![npm](https://img.shields.io/npm/l/reev.svg)](https://www.npmjs.com/package/reev)

__event based global state manager__

## Installation

```ruby
npm i reev
```

or

```ruby
yarn add reev
```

## Getting Started

```ts
import { useState } from 'react'
import { useEvent } from 'reev'

function App() {
  const [text, set] = useState("");
  const key = useEvent({
    mount: () => window.addEventListener("keydown", (e) => key(e.key)),
    clean: () => window.removeEventListener("keydown", (e) => key(e.key)),
    Enter: () => set(""),
    " ": (_key, _ = "_") => set((p) => p + _),
    a: (key) => key(" ", "A"),
    b: (key) => key(" ", "B") // to z
  });
  /**
   * mount and clean to request event listener
   */
  useEffect(() => void key("mount"), [key]);
  useEffect(() => () => key("clean"), [key]);

  return text || `PRESS_KEYBOARD`;
}

createRoot(document.getElementById("root")).render(<App />);
```
<!-- 
```ts
import * as React from 'react'
import { createRoot } from 'react-dom/client'
import { reev } from 'reev' // create events
import { gsap } from 'gsap' // animation lib

const Event = reev
    .init((e) => state.keydown = ({ key }) => state(key))
    .mount((e) => addEventListener('keydown', state.keydown))
    .unmount((e) => removeEventListener('keydown', state.keydown))

const Space = () => {
  const ref = React.useRef()
  Event
    .use(' ', (_e, x = 0, y = 0) => gsap.to(ref.current, { x, y }))
    .use('a', (e) => e(' ', -1, 0))
    .use('s', (e) => e(' ', 0, -1))
    .use('d', (e) => e(' ', 1, 0))
    .use('w', (e) => e(' ', 0, 1))

  return <div ref={ref} />
}

createRoot(document.getElementById('root')).render(<Event><Space /></Event>);
``` -->
