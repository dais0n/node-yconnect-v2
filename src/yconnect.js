const request = require('request-promise');
const IdToken = require('./idtoken');

const tokenUrl    = 'https://auth.login.yahoo.co.jp/yconnect/v2/token';
const pubKeyUrl   = 'https://auth.login.yahoo.co.jp/yconnect/v2/public-keys';
const userInfoUrl = 'https://userinfo.yahooapis.jp/yconnect/v2/attribute';

class yconnect {
  constructor(clientId, clientSec, redirectUri) {
    this.clientId    = clientId;
    this.clientSec   = clientSec;
    this.redirectUri = redirectUri
  }

  setIdToken(idToken) {
    this.idToken = new IdToken(idToken);
  }

  authorization(code, nonce) {
    return new Promise((resolve, reject) => {
      this.tokenRequest(code)
        .then((response) => {
          this.setIdToken(response['id_token']);
          let accessToken = response['access_token']
          // get now
          let date = new Date();
          let tmpDate = date.getTime();
          // format
          let now = Math.floor( tmpDate / 1000 );

          if (!this.idToken.checkPayload(this.clientId, nonce, now)) {
            reject('check payload failed');
          }
          this.pubKeyRequest(this.idToken.getKid())
            .then((response) => {
              if (!this.idToken.verifySignature(response[this.idToken.getKid()])) {
                reject('check signature failed');
              }
              resolve(accessToken);
            })
            .catch((error) => {
              reject(error);
            });
        })
        .catch((error) => {
          reject(error)
        });
    });
  }

  tokenRequest(code) {
    return new Promise((resolve, reject) => {
      request({
        uri: tokenUrl,
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        form: {
          code: code,
          client_id: this.clientId,
          client_secret: this.clientSec,
          redirect_uri: this.redirectUri,
          grant_type: 'authorization_code'
        },
        json: true
      })
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject('token request error');
      })
    });
  }

  pubKeyRequest(kid) {
    return new Promise((resolve, reject) => {
      request({uri: pubKeyUrl, json: true})
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          reject('pubkey request failed')
        })
    })
  }

  getUserInfo(accessToken) {
    return new Promise((resolve, reject) => {
      request({url: userInfoUrl, headers: { 'Authorization': ' Bearer ' + accessToken}, json: true})
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        })
    })
  }
}

module.exports = yconnect;
