const request = require('request-promise');
cosst IdToken = require('./idtoken');

const tokenUrl    = 'https://auth.login.yahoo.co.jp/yconnect/v2/token';
const pubKeyUrl   = 'https://auth.login.yahoo.co.jp/yconnect/v2/public-keys';
const userInfoUrl = 'https://userinfo.yahooapis.jp/yconnect/v2/attribute';

class yconnect {
  constructor(clientId, clientSec, redirectUri) {
    this.accessToken;
    this.clientId    = clientId;
    this.clientSec   = clientSec;
    this.redirectUri = redirectUri
  }

  setIdToken(idToken) {
    this.idToken = new IdToken(idToken);
  }

  setAccessToken(accessToken) {
    this.accessToken = accessToken;
  }

  authorization(code) {
    return new Promise((resolve, reject) => {this.tokenRequest(code)
      .then((response) => {
        setIdToken(response['id_token']);
        setAccessToken(response['access_token']);
        if (!this.idToken.checkPayload()) {
          reject('check payload failed');
        }
        this.pubKeyRequest(idToken.getKid())
          .then((response) => {
            if (!this.idToken.verifySignature(response[idToken.getKid()]) {
              reject('check signature failed');
            }
            resolve(this.accessToken);
          })
          .catch((error) => {
            reject(error);
          });
      })
      .catch((error) => {
        reject(error)
      });
    );
  }

  tokenRequest(code) {
    return new Promise((resolve, reject) => {
      request.({
        uri: tokenUrl,
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        form: {
          code: code,
          client_id: clientId,
          client_secret: clientSec,
          redirect_uri: redirectUri,
          grant_type: 'authorization_code'
        },
        json: true
      })
      .then(response) => {
        resolve(response);
      }
      .catch(error) => {
        reject('token request error');
      }
    });
  }

  pubKeyRequest(kid) {
    return new Promise((resolve, reject) => {
      request(pubKeyUrl)
        .then((response) => {
          resolve(response);
        })
        .catch(error) => {
          reject('pubkey request failed')
        }
    })
  }
}

module.exports = yconnect;
