# node-yconnect-v2
[![NPM](https://nodei.co/npm/node-yconnect-v2.png?compact=true)](https://npmjs.org/package/node-yconnect-v2)
[![Build Status](https://travis-ci.org/dais0n/node-yconnect-v2.svg?branch=master)](https://travis-ci.org/dais0n/node-yconnect-v2)
[![MIT License](http://img.shields.io/badge/license-MIT-blue.svg?style=flat)](LICENSE)
Yahoo! Japan Openid Connect Client Library for [YConnect v2](https://developer.yahoo.co.jp/yconnect/v2/)

## Installation
```bash
npm install node-yconnect-v2 --save
```

## Usage

```javascript
const YConnect = require('node-yconnect-v2');

const yconnect = new YConnect(clientId, clientSec, redirectUri);

// authorization code flow
yconnect.authorization(req.query.code, req.session.nonce)
.then((accessToken) => {
  // userinfo request
  return yconnect.getUserInfo(accessToken);
})
.then((userinfo) => {
  // userinfo.name, userinfo.gender
  console.log(userinfo);
})
.catch((err) => {
  console.log(err);
});
```
