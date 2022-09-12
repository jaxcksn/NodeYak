# NodeYak - A NodeJS YikYak API Wrapper

A javascript library for posting and interacting with the YikYak API.

## Important Note:

This library is for education purposes only. Using the API directly for any reason is against YikYak community guidelines, and will/can result in being banned from the platform.

Additionally, I will not be documenting nor providing a method anywhere in the project on getting authorization/refresh tokens for the API.

## Installation

Install using your package manager of choice:

```shell
$ npm i nodeyak
```

## Example Usage

```js
import { NodeYak } from 'nodeyak';

let authorization = {
  authToken: '[AUTH TOKEN]',
  refreshToken: '[REFRESH TOKEN]',
};

let YakManager = new NodeYak(authorization);
YakManager.createYak({
  text: 'Hello World',
  userEmoji: '🤠',
  firstColor: '#FF0000',
  secondColor: '#ee0000',
  postedFrom: {
    lat: 40.6,
    lon: -73.9,
  },
  locations: ['Brooklyn, NY'],
  isIncognito: true,
});
```
