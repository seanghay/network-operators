# Network Operators

A package for querying network operators in Cambodia.

[![test](https://github.com/seanghay/network-operators/actions/workflows/test.yml/badge.svg)](https://github.com/seanghay/network-operators/actions/workflows/test.yml)
[![npm](https://img.shields.io/npm/v/network-operators)](https://npmjs.com/package/network-operators)

## Install

npm

```
npm install network-operators
```

pnpm

```
pnpm add network-operators
```

yarn
```
yarn add network-operators
```

## Usage

```js
// ESM
import { 
  prefixInfo, 
  phoneNumberInfo, 
  networkOperators, 
  parsePhoneNumber 
} from 'network-operators'

// CJS
const { 
  prefixInfo, 
  phoneNumberInfo, 
  networkOperators, 
  parsePhoneNumber 
} = require('network-operators')

console.log(prefixInfo('012'))
// { operator: 'Cellcard', length: [ 6, 7 ] }

console.log(phoneNumberInfo('012123123'))
// {
//   operator: 'Cellcard',
//   length: [ 6, 7 ],
//   prefix: '012',
//   suffix: '123123',
//   number: '012123123'
// }

console.log(networkOperators())
// [
//   'Cellcard', 'CooTel',
//   'Kingtel',  'Seatel',
//   'Metfone',  'qb',
//   'Smart'
// ]

console.log(parsePhoneNumber('010123123'))
// { prefix: '010', suffix: '123123', number: '010123123' }
```


## License

Apache-2.0
