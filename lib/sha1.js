/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
/* SHA-1 (FIPS 180-4) implementation in JavaScript                    (c) Chris Veness 2002-2017  */
/*                                                                                   MIT Licence  */
/* www.movable-type.co.uk/scripts/sha1.html                                                       */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

'use strict';

/**
 * SHA-1 hash function reference implementation.
 *
 * This is an annotated direct implementation of FIPS 180-4, without any optimisations. It is
 * intended to aid understanding of the algorithm rather than for production use.
 *
 * While it could be used where performance is not critical, I would recommend using the ‘Web
 * Cryptography API’ (developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest) for the browser,
 * or the ‘crypto’ library (nodejs.org/api/crypto.html#crypto_class_hash) in Node.js.
 *
 * See csrc.nist.gov/groups/ST/toolkit/secure_hashing.html
 *     csrc.nist.gov/groups/ST/toolkit/examples.html
 */

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Sha1 = function () {
    function Sha1() {
        _classCallCheck(this, Sha1);
    }

    _createClass(Sha1, null, [{
        key: 'hash',


        /**
         * Generates SHA-1 hash of string.
         *
         * @param   {string} msg - (Unicode) string to be hashed.
         * @param   {Object} [options]
         * @param   {string} [options.msgFormat=string] - Message format: 'string' for JavaScript string
         *   (gets converted to UTF-8 for hashing); 'hex-bytes' for string of hex bytes ('616263' ≡ 'abc') .
         * @param   {string} [options.outFormat=hex] - Output format: 'hex' for string of contiguous
         *   hex bytes; 'hex-w' for grouping hex bytes into groups of (4 byte / 8 character) words.
         * @returns {string} Hash of msg as hex character string.
         */
        value: function hash(msg, options) {
            var defaults = { msgFormat: 'string', outFormat: 'hex' };
            var opt = Object.assign(defaults, options);

            switch (opt.msgFormat) {
                default: // default is to convert string to UTF-8, as SHA only deals with byte-streams
                case 'string':
                    msg = utf8Encode(msg);break;
                case 'hex-bytes':
                    msg = hexBytesToString(msg);break; // mostly for running tests
            }

            // constants [§4.2.1]
            var K = [0x5a827999, 0x6ed9eba1, 0x8f1bbcdc, 0xca62c1d6];

            // initial hash value [§5.3.1]
            var H = [0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476, 0xc3d2e1f0];

            // PREPROCESSING [§6.1.1]

            msg += String.fromCharCode(0x80); // add trailing '1' bit (+ 0's padding) to string [§5.1.1]

            // convert string msg into 512-bit/16-integer blocks arrays of ints [§5.2.1]
            var l = msg.length / 4 + 2; // length (in 32-bit integers) of msg + ‘1’ + appended length
            var N = Math.ceil(l / 16); // number of 16-integer-blocks required to hold 'l' ints
            var M = new Array(N);

            for (var i = 0; i < N; i++) {
                M[i] = new Array(16);
                for (var j = 0; j < 16; j++) {
                    // encode 4 chars per integer, big-endian encoding
                    M[i][j] = msg.charCodeAt(i * 64 + j * 4 + 0) << 24 | msg.charCodeAt(i * 64 + j * 4 + 1) << 16 | msg.charCodeAt(i * 64 + j * 4 + 2) << 8 | msg.charCodeAt(i * 64 + j * 4 + 3) << 0;
                } // note running off the end of msg is ok 'cos bitwise ops on NaN return 0
            }
            // add length (in bits) into final pair of 32-bit integers (big-endian) [§5.1.1]
            // note: most significant word would be (len-1)*8 >>> 32, but since JS converts
            // bitwise-op args to 32 bits, we need to simulate this by arithmetic operators
            M[N - 1][14] = (msg.length - 1) * 8 / Math.pow(2, 32);M[N - 1][14] = Math.floor(M[N - 1][14]);
            M[N - 1][15] = (msg.length - 1) * 8 & 0xffffffff;

            // HASH COMPUTATION [§6.1.2]

            for (var _i = 0; _i < N; _i++) {
                var W = new Array(80);

                // 1 - prepare message schedule 'W'
                for (var t = 0; t < 16; t++) {
                    W[t] = M[_i][t];
                }for (var _t = 16; _t < 80; _t++) {
                    W[_t] = Sha1.ROTL(W[_t - 3] ^ W[_t - 8] ^ W[_t - 14] ^ W[_t - 16], 1);
                } // 2 - initialise five working variables a, b, c, d, e with previous hash value
                var a = H[0],
                    b = H[1],
                    c = H[2],
                    d = H[3],
                    e = H[4];

                // 3 - main loop (use JavaScript '>>> 0' to emulate UInt32 variables)
                for (var _t2 = 0; _t2 < 80; _t2++) {
                    var s = Math.floor(_t2 / 20); // seq for blocks of 'f' functions and 'K' constants
                    var T = Sha1.ROTL(a, 5) + Sha1.f(s, b, c, d) + e + K[s] + W[_t2] >>> 0;
                    e = d;
                    d = c;
                    c = Sha1.ROTL(b, 30) >>> 0;
                    b = a;
                    a = T;
                }

                // 4 - compute the new intermediate hash value (note 'addition modulo 2^32' – JavaScript
                // '>>> 0' coerces to unsigned UInt32 which achieves modulo 2^32 addition)
                H[0] = H[0] + a >>> 0;
                H[1] = H[1] + b >>> 0;
                H[2] = H[2] + c >>> 0;
                H[3] = H[3] + d >>> 0;
                H[4] = H[4] + e >>> 0;
            }

            // convert H0..H4 to hex strings (with leading zeros)
            for (var h = 0; h < H.length; h++) {
                H[h] = ('00000000' + H[h].toString(16)).slice(-8);
            } // concatenate H0..H4, with separator if required
            var separator = opt.outFormat == 'hex-w' ? ' ' : '';

            return H.join(separator);

            /* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

            function utf8Encode(str) {
                try {
                    return new TextEncoder().encode(str, 'utf-8').reduce(function (prev, curr) {
                        return prev + String.fromCharCode(curr);
                    }, '');
                } catch (e) {
                    // no TextEncoder available?
                    return unescape(encodeURIComponent(str)); // monsur.hossa.in/2012/07/20/utf-8-in-javascript.html
                }
            }

            function hexBytesToString(hexStr) {
                // convert string of hex numbers to a string of chars (eg '616263' -> 'abc').
                var str = hexStr.replace(' ', ''); // allow space-separated groups
                return str == '' ? '' : str.match(/.{2}/g).map(function (byte) {
                    return String.fromCharCode(parseInt(byte, 16));
                }).join('');
            }
        }

        /**
         * Function 'f' [§4.1.1].
         * @private
         */

    }, {
        key: 'f',
        value: function f(s, x, y, z) {
            switch (s) {
                case 0:
                    return x & y ^ ~x & z; // Ch()
                case 1:
                    return x ^ y ^ z; // Parity()
                case 2:
                    return x & y ^ x & z ^ y & z; // Maj()
                case 3:
                    return x ^ y ^ z; // Parity()
            }
        }

        /**
         * Rotates left (circular left shift) value x by n positions [§3.2.5].
         * @private
         */

    }, {
        key: 'ROTL',
        value: function ROTL(x, n) {
            return x << n | x >>> 32 - n;
        }
    }]);

    return Sha1;
}();

exports.default = Sha1;