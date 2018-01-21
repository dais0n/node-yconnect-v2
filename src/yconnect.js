const request = require( 'request-promise' );
const IdToken = require( './idtoken' );

/**
 * YConnect class.
 * @class Yconnect
 */
class YConnect {
  /**
   * @constructor YConnect
   * @param {string} clientId
   * @param {string} clientSec
   * @param {string} redirectUri
   */
  constructor( clientId, clientSec, redirectUri ) {
    /**
     * client id
     * @member YConnect#clientId
     */
    this.clientId = clientId;
    /**
     * client secret
     * @member YConnect#clientSec
     */
    this.clientSec = clientSec;
    /**
     * redirect uri
     * @member YConnect#redirectUri
     */
    this.redirectUri = redirectUri;
  }

  /**
   * set id token
   * @param {string} idToken
   */
  setIdToken( idToken ) {
    this.idToken = new IdToken( idToken );
  }

  /**
   * authorization request
   * @param {string} code
   * @param {string} nonce
   * @return {object} Promise
   */
  async authorization( code, nonce ) {
    try {
      // token request
      const tokenResponse = await this.tokenRequest(code);
      this.setIdToken(tokenResponse.id_token);

      // get now
      const date = new Date();
      const tmpDate = date.getTime();
      const now = Math.floor( tmpDate / 1000 );

      // check Payload
      if ( !this.idToken.checkPayload( this.clientId, nonce, now ) ) {
        console.log('check payload failed' );
      }

      // key request
      const keyResponse = await this.pubKeyRequest(this.idToken.getKid());
      const keyid = keyResponse[this.idToken.getKid()];

      // chech signature
      if ( !this.idToken.verifySignature( keyid ) ) {
        console.log('check signature failed' );
      }
      return true;
    } catch (err) {
      console.log(err);
    }
  }


  /**
   * token request
   * @param {string} code
   * @return {object} Promise
   */
  async tokenRequest( code ) {
    const options = {
      'uri': 'https://auth.login.yahoo.co.jp/yconnect/v2/token',
      'method': 'POST',
      'headers': {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      'form': {
        'code': code,
        'client_id': this.clientId,
        'client_secret': this.clientSec,
        'redirect_uri': this.redirectUri,
        'grant_type': 'authorization_code',
      },
      'json': true,
    };
    return await request(options);
  }

  /**
   * pubkey request
   * @return {object} Promise
   */
  async pubKeyRequest() {
    const options = {
      url: 'https://auth.login.yahoo.co.jp/yconnect/v2/public-keys',
      json: true,
    };
    return await request.get(options);
  }


  /**
   * userinfo request
   * @param {string} accessToken
   * @return {object} Promise
   */
  async getUserInfo( accessToken ) {
    const options = {
      'url': 'https://userinfo.yahooapis.jp/yconnect/v2/attribute',
      'headers': {'Authorization': ` Bearer ${ accessToken}`},
      'json': true,
    };
    return await request.get(options);
  }
}

module.exports = YConnect;
