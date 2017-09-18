'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _sha = require('./sha1');

var _sha2 = _interopRequireDefault(_sha);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TOKEN = 37;

/**
 * Create new collection instance 
 * 
 * @class TrashCollectionDb
 * @param {String} name collection name
 */

var TrashCollectionDb = function () {
    function TrashCollectionDb(name) {
        _classCallCheck(this, TrashCollectionDb);

        this.collection_name = name;
        this.collection = new Map();
    }

    /**
     * Convert `Map` object to simple JavaScript Object
     * @param {Map} d 
     * @return {Object}
     */


    _createClass(TrashCollectionDb, [{
        key: 'toObject',
        value: function toObject(d) {
            return Object.assign({}, Array.from(d)[0][1]);
        }

        /**
         * Fetch last inserted id into the collection
         * @return {CollectionID}
         */

    }, {
        key: 'lastId',
        value: function lastId() {
            // $FlowFixMe
            return [].concat(_toConsumableArray(this.collection.keys()))[this.collection.size - 1];
        }

        /**
         * Check if given `ID` exist into the collection 
         * @param {CollectionId} id 
         * @return {Boolean}
         */

    }, {
        key: 'exist',
        value: function exist(id) {
            return this.collection.has(id);
        }

        /**
         * Fetch data by Id from the colletion MapObject 
         * @param {CollectionId} id 
         * @return {CollectionDocument}
         */

    }, {
        key: 'fetch',
        value: function fetch(id) {
            return Object.assign({}, this.collection.get(id));
        }

        /**
         * Single record insert  
         * @param {Any} data 
         * @return {Any}
         * 
         */

    }, {
        key: 'insert',
        value: function insert(data) {
            var document = newDocument(data);
            this.collection.set(document.id, document);
            return this.fetch(document.id);
        }

        /**
         * Insert multiple records into the colletion 
         * @param {Array} data 
         * @return {Array}
         */

    }, {
        key: 'bulkInsert',
        value: function bulkInsert(data) {
            var _this = this;

            return data.map(function (row) {
                var document = newDocument(row);
                _this.collection.set(document.id, document);
                return _this.fetch(document.id);
            });
        }

        /**
         * Update record from the collection by passing ID to locate and overwrite it.
         * @NOTE you must pass the how object or you may lose some of the data into the process 
         * @param {CollectionId} id 
         * @param {Object} data 
         * @return {CollectionDocument}
         */

    }, {
        key: 'update',
        value: function update(id, data) {
            var document = this.fetch(id);
            if (document) {
                var updateAt = new Date().getTime() + 1;
                var updated_document = Object.assign(
                // Base object
                {},
                // Old version of the document
                document,
                // Updated version of the document
                data,
                // Updated metadata
                {
                    metadata: {
                        created_at: document.metadata.created_at,
                        updated_at: updateAt
                    }
                });

                this.collection.set(document.id, updated_document);
                return this.fetch(document.id);
            }
            return document;
        }

        /**
         * Remove record by `ID` from collection 
         * @param {CollectionId} id 
         * @return {Boolean}
         */

    }, {
        key: 'trash',
        value: function trash(id) {
            return this.collection.delete(id);
        }

        /**
         * Truncate the collection
         * @return {Void}
         */

    }, {
        key: 'trashAll',
        value: function trashAll() {
            this.collection.clear();
        }

        /**
         * Return Iterator to iterate from all the `CollectionId`s inserted into 
         * the collection 
         * @return {Array}
         */

    }, {
        key: 'indexes',
        value: function indexes() {
            // $FlowFixMe
            return [].concat(_toConsumableArray(this.collection.keys()));
        }

        /**
         * Return array of all records from the collection
         * @return {Array}
         */

    }, {
        key: 'records',
        value: function records() {
            // $FlowFixMe
            return [].concat(_toConsumableArray(this.collection.values()));
        }

        /**
         * Return the number of records inside the collection
         * @return {Number}
         */

    }, {
        key: 'size',
        value: function size() {
            return this.collection.size;
        }

        /**
         * Create paging to iterate from all the data 
         * @param {Object} options 
         * @param {Number} options.pageSize
         */

    }, {
        key: 'paging',
        value: function paging(pageNumber, pageSize) {
            var records = Array.from(this.collection.values());
            var offset = (pageNumber - 1) * pageSize;
            var total = records.length;

            return {
                page: pageNumber,
                pages: Math.ceil(total / pageSize),
                limit: pageSize,
                total: total,
                records: records.slice(offset, offset + pageSize)
            };
        }
    }]);

    return TrashCollectionDb;
}();

/**
 * Create record entity by generating ID and metadata 
 * 
 * @param {Any} document 
 * @return {Object}
 */


exports.default = TrashCollectionDb;
function newDocument(document) {
    var time = new Date().valueOf();
    return {
        id: _sha2.default.hash(time * TOKEN + Math.random() * 100),
        data: document,
        metadata: {
            created_at: time,
            updated_at: time
        }
    };
}

/**
 * Generate experimental ID to be use az UUID
 * @NOTE: not in use
 */
function experimentalId() {
    return (+new Date() + Math.random() * 100).toString(32);
}