'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _collection = require('./collection');

var _collection2 = _interopRequireDefault(_collection);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Create single instance of TrashDb 
 * @class TrashDb
 * @params {Object} props
 */
var TrashDb = function () {
    function TrashDb() {
        var prop = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, TrashDb);

        this.db = {};
    }

    /**
     * Access or create a single collection
     *  
     * @param {String} name 
     */


    _createClass(TrashDb, [{
        key: 'collection',
        value: function collection(name) {
            if (!this.db[name]) {
                this.db[name] = new _collection2.default(name);
            }

            return this.db[name];
        }

        /**
         * All created or accessed collections
         * @return {Array}
         */

    }, {
        key: 'collections',
        value: function collections() {
            return Object.keys(this.db);
        }

        /**
         * Convert all data into single object ready to be exported as JSON or 
         * some other format
         * 
         * @example
         *   {
         *     'collection_name': [ ...records ]
         *   }
         * 
         * @return {Object}
         */

    }, {
        key: 'toObject',
        value: function toObject() {
            var _this = this;

            var result = {};
            Object.keys(this.db).map(function (collection) {
                result[collection] = _this.db[collection].records();
            });
            return result;
        }
    }]);

    return TrashDb;
}();

exports.default = TrashDb;