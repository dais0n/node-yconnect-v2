const jwt = require( 'jsonwebtoken' );

const issuer = 'https://auth.login.yahoo.co.jp/yconnect/v2';
const requiredKeys = [
  'iss', 'sub', 'aud', 'exp', 'iat', 'amr', 'nonce', 'at_hash',
];

/**
 * IdToken class.
 * @class IdToken
 */
class IdToken {
  /**
   * @constructor IdToken
   * @param {string} token
   */
  constructor( token ) {
    /**
     * raw idtoken
     * @member IdToken#token
     */
    this.token = token;

    /**
     * decoded idtoken
     * @member IdToken#decodedToken
     */
    this.decodedToken = jwt.decode( token, {'complete': true} );
  }

  /**
   * get pubkey kid
   * @return {string}
   */
  getKid() {
    return this.decodedToken.header.kid;
  }

  /**
   * check id token format
   * @return {boolean}
   */
  checkFormat() {
    for ( let key of requiredKeys ) {
      if ( !( key in this.decodedToken.payload ) ) {
        return false;
      }
    }
    return true;
  }

  /**
   * check exp time
   * @param {number} now
   * @return {boolean}
   */
  checkExpTime( now ) {
    if ( now > this.decodedToken.payload.exp ) {
      return false;
    }
    return true;
  }

  /**
   * check iat time
   * @param {number} now
   * @return {boolean}
   */
  checkIatTime( now ) {
    // check iat within 10 minuts from now
    let acceptableRange = 600;
    let timeDiff = now - this.decodedToken.payload.iat;

    if ( timeDiff > acceptableRange ) {
      return false;
    }
    return true;
  }

  /**
   * check payload
   * @param {string} clientId
   * @param {string} nonce
   * @param {number} now
   * @return {boolean}
   */
  checkPayload( clientId, nonce, now ) {
    // check format
    if ( !this.checkFormat() ) {
      return false;
    }

    // check issuer
    if ( issuer !== this.decodedToken.payload.iss ) {
      return false;
    }

    // check nonce
    if ( nonce !== this.decodedToken.payload.nonce ) {
      return false;
    }

    // check client_id
    if ( clientId !== this.decodedToken.payload.aud ) {
      return false;
    }

    // Is corrent time less than exp ?
    if ( !this.checkExpTime( now ) ) {
      return false;
    }

    // check iat within 10 minuts from now
    if ( !this.checkIatTime( now ) ) {
      return false;
    }

    return true;
  }

  /**
   * verify signature
   * @param {string} pubKey
   * @return {boolean}
   */
  verifySignature( pubKey ) {
    return jwt.verify(
      this.token,
      pubKey,
      {'algorithms': ['RS256']},
      ( err, payload ) => {
        // if token alg !== RS256,  err !== invalid signature
        if ( err !== null ) {
          return false;
        }
        return true;
      }
    );
  }
}

module.exports = IdToken;
