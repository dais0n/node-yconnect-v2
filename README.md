# passport-yj-v2

## Usage
```javascript
var yconnect = new YConnect(clientId, clientSec, redirectUri);
// token request and check payload and verify id_token
yconnect.authorization(req.query.code, req.session.nonce)
.then((accessToken) => {
  // user info request
  yconnect.getUserInfo(accessToken)
    .then((userinfo) => {
      console.log(userinfo);
    })
    .catch((error) => {
      console.log(error);
    })
})
.catch((error) => {
  console.log(error);
})

```
