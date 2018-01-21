# node-yconnect-v2
Yahoo! Japan Openid Connect Client Library for [YConnect v2](https://developer.yahoo.co.jp/yconnect/v2/)

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
