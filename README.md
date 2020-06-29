# ecsy-input
A simple, cross-platform input system for ECSY

# Why Do I Need This?
Mapping a WASD keyboard to drive movement or state is easy enough for a few inputs-- but once you start developing complex behaviors, and you need them accounted for across multiple platforms or input types, it quickly becomes a monstrous task to maintain or add additional functionality to your input <-> response loops without having to test for lots of unintended consequences, often marking up your code with conditionals to prevent unwanted state from these new actions (some people want crouching + jumping, some people want either/or)

ecsy-input abstracts the complexity of the input layer down to "actions". All input is collected, mapped to actions, and then validated at the action layer-- opposing, overriding and blocking actions are considered and then pushed to any entity with an ActionListener component attached. While default input mappings are provided, ecsy-input can be initialized with custom input mappings, so you can decide what inputs map to what actions and how actions relate to each other.

ecsy-input is not tied to any particular game engine, so you can use it anywhere you use ECSY.

# Installation
```
npm install ecsy-input
```

# How to use
```javascript
import { World } from 'ecsy'
import {  initializeInputSystems } from 'ecsy-input'

const world = new World()

const options = {
  vr: true,
  ar: false,
  mouse: true,
  keyboard: true,
  touchscreen: false,
  gamepad: true,
  debug: true
}

initializeInputSystems(world, options)

world.execute()
```

You can override the input mappings per device
Input mappings map device input to abstract, cross-platform actions

```
const KeyboardInputMap = {
  w: ActionType.FORWARD,
  a: ActionType.LEFT,
  s: ActionType.RIGHT,
  d: ActionType.BACKWARD
}

initializeInputSystems(world, options, KeyboardInputMap)
``

# To Build
```
npm run build
```
This will open up the rollup dev server on port 10001
You can see input in the console
