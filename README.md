# @tawaship/transceiver

**A module for mutual messaging between multiple objects.**

[![MIT License](http://img.shields.io/badge/license-MIT-blue.svg?style=flat)](LICENSE)

---

## Setup

### NPM

```sh
npm install --save @tawaship/transceiver
```

<br />

```javascript
import { Transceiver } from '@tawaship/transceiver';
```

### Browser

```sh
git clone https://github.com/tawaship/Transceiver
```

<br />

```html
<script src="/path/to/dist/Transceiver.min.js"></script>
```

## Usage

### Create transceivers

```javascript
const [ A, B, C ] = Transceiver.create(3);
```

### Listen event

```javascript
A.on('hoge', e => {
	console.log('A');
});

B.on('moge', e => {
	console.log('B');
});

C.on('fuga', e => {
	console.log('C');
});
```

### Send event

Note that unlike a typical Emitter, it does not fire an event to itself.

```javascript
A.emit('hoge'); // (nothing)
A.emit('moge'); // B
A.emit('fuga'); // C
B.emit('hoge'); // A
B.emit('moge'); // (nothing)
B.emit('fuga'); // C
C.emit('hoge'); // A
C.emit('moge'); // B
C.emit('fuga'); // (nothing)
```