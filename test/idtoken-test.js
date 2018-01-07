var assert  = require('assert');
var IdToken = require('../lib/idToken');
var fs      = require('fs');
var path    = require('path');

const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6IjBjYzE3NWI5YzBmMWI2YTgzMWMzOTllMjY5NzcyNjYxIn0.eyJpc3MiOiJodHRwczpcL1wvYXV0aC5sb2dpbi55YWhvby5jby5qcFwveWNvbm5lY3RcL3YyIiwic3ViIjoiMlpMNDc3TzdVTUI1NEJOQ01JR05aWlU1RlEiLCJhdWQiOlsiZGowMGFpWnBQVFpuTlZnMWRrSk9aMUJ6UkNaelBXTnZibk4xYldWeWMyVmpjbVYwSm5nOU1qYy0iXSwiZXhwIjoxNTE3NzI3NzM3LCJpYXQiOjE1MTUzMDg1MzcsImFtciI6WyJwd2QiXSwibm9uY2UiOiJzZzJ4ZjJhbCIsImF0X2hhc2giOiJxQzZ0ckxTTlJxcGl5M1IyaVMxN0J3In0.ZHykyeqNRjwfiPSpKdkgFwwLMUI9QKH2WdLq44_D3ZN0ULXMn7sVCKfRG9VYsNvriAImzNatlZIqfZsrKm7T29woBEMHgNwRffUDnRYDECw6tWuWzc5jfkgV-5EFuwl08hgelpfv3nwM8oqTIwJAmDOiOJl45-awr9p34cGY8nQL-80dejT_1L5RIFsZGjgjwwZWXwLb5habblaWI8sxRSPLkmMR4Ixin8sQHkSyrkbhMwzUG0rrkZ2Z7D_ujuq2G9XIHNWjFP7h_5pSC0unJhRPP0vlTTT27amBZtD2Jo2IiJXGtvuDx29-2l2mJTP78rY7LqHJNhglDJuUkL2TlQ'
const clientId = 'dj00aiZpPTZnNVg1dkJOZ1BzRCZzPWNvbnN1bWVyc2VjcmV0Jng9Mjc-';
const nonce    = 'sg2xf2al';
const now      = 1515309120; // 2018/1/7 16:12:00;

describe('idToken', function () {
    describe('getkey', function () {
        it('normal', function () {
            var idToken = new IdToken(token);
            assert.equal(idToken.getKid(), '0cc175b9c0f1b6a831c399e269772661');
        });
    });

    describe('checkExpTime', function () {
        var idToken = new IdToken(token);
        it('normal', function () {
            assert.equal(idToken.checkExpTime(now), true);
        });

        it('expired date', function () {
            var date = 1517727738; // 2018/2/4 16:02:18 expired date
            assert.equal(idToken.checkExpTime(date), false);
        });
    });

    describe('checkIatTime', function () {
        var idToken = new IdToken(token);
        it('normal', function () {
            assert.equal(idToken.checkIatTime(now), true);
        });

        it('expired date', function () {
            var date = 1517727738; // 2018/2/4 16:02:18 expired date
            assert.equal(idToken.checkIatTime(date), false);
        });
    });

    describe('checkPayload', function () {
        it('normal', function () {
            var idToken = new IdToken(token);
            assert.equal(idToken.checkPayload(clientId, nonce, now), true);
        });

        it('invalid clientId', function () {
            var clientId = 'dj00aiZpg1dkJOZ1BzRCZzPWNvbnN1bWVyc2VjcmV0Jng9Mjc-';
            var idToken = new IdToken(token);
            assert.equal(idToken.checkPayload(clientId, nonce, now), false);
        });

        it('invalid nonce', function () {
            var nonce = 'invalid nonce';
            var idToken = new IdToken(token);
            assert.equal(idToken.checkPayload(clientId, nonce, now), false);
        });
    });

    describe('verifySignature', function () {
        it('normal', function () {
            var pubKey = fs.readFileSync(path.join(__dirname, 'pub.pem'));
            var idToken = new IdToken(token);
            assert.equal(idToken.verifySignature(pubKey), true);
        });

        it('invalid pubKey', function () {
            var pubKey  = 'invalid pubkey'
            var idToken = new IdToken(token);
            assert.equal(idToken.verifySignature(pubKey), false);
        });
    });
});
