'use strict'

import Sha1 from './sha1'

const TOKEN = 37;
/**
 * Create new collection instance 
 * 
 * @class TrashCollectionDb
 * @param {String} name collection name
 */
export default class TrashCollectionDb {
    constructor(name) {
        this.collection_name = name;
        this.collection = new Map();
        this.lastInsertedId = undefined;
    }

    /**
     * Convert `Map` object to simple JavaScript Object
     * @param {Map} d 
     * @return {Object}
     */
    toObject(d) {
        return Object.assign({}, Array.from(d)[0][1]);
    }

    /**
     * Fetch last inserted id into the collection
     * @return {CollectionID}
     */
    lastId() {
        return [...this.collection.keys()][this.collection.size]
    }

    /**
     * Check if given `ID` exist into the collection 
     * @param {CollectionId} id 
     * @return {Boolean}
     */
    exist(id) {
        return this.collection.has(id)
    }

    /**
     * Fetch data by Id from the colletion MapObject 
     * @param {CollectionId} id 
     * @return {Object}
     */
    fetch(id) {
        return Object.assign({}, this.collection.get(id))
    }

    /**
     * Single record insert  
     * @param {Any} data 
     * @return {Any}
     * 
     */
    insert(data) {
        const document = newDocument(data)
        this.collection.set(document.id, document)
        return this.collection.get(document.id)
    }

    /**
     * Insert multiple records into the colletion 
     * @param {Array} data 
     * @return {Array}
     */
    bulkInsert(data) {
        return data.map((row) => {
            const document = newDocument(row);
            this.collection.set(document.id, document)
            return this.collection.get(document.id);
        })
    }

    /**
     * Update record from the collection by passing ID to locate and overwrite it.
     * @NOTE you must pass the how object or you may lose some of the data into the process 
     * @param {CollectionId} id 
     * @param {Object} data 
     * @return {Object|Boolean}
     */
    update(id, data) {
        let document = this.fetch(id);
        const updateAt = new Date().getTime();
        if (document) {
            document = Object.assign({}, document, data);
            document.metadata.updated_at = updateAt; 
            this.collection.set(document.id, document)
            return this.collection.get(document.id)
        }
        return false
    }

    /**
     * Remove record by `ID` from collection 
     * @param {CollectionId} id 
     * @return {Boolean}
     */
    trash(id) {
        return this.collection.delete(id)
    }

    /**
     * Truncate the collection
     * @return {Boolean}
     */
    trashAll() {
        return this.collection.clear()
    }

    /**
     * Return Iterator to iterate from all the `CollectionId`s inserted into 
     * the collection 
     * @return {Array}
     */
    indexes() {
        return [...this.collection.keys()];
    }

    /**
     * Return array of all records from the collection
     * @return {Array}
     */
    records() {
        return [...this.collection.values()]
    }

    /**
     * Return the number of records inside the collection
     * @return {Number}
     */
    size() {
        return this.collection.size
    }

    /**
     * Create paging to iterate from all the data 
     * @param {Object} options 
     * @param {Number} options.pageSize
     */
    paging(pageNumber, pageSize) {
        const records = Array.from(this.collection.values());
        const offset = (pageNumber - 1) * pageSize;
        const total = records.length; 

        return {
            page: pageNumber,
            pages: Math.ceil(total / pageSize),
            limit: pageSize,
            total: total,
            records: records.slice(offset, offset + pageSize)
        }
    }
}

/**
 * Create record entity by generating ID and metadata 
 * 
 * @param {Any} document 
 * @return {Object}
 */
function newDocument(document) {
    const time = new Date().valueOf();
    return {
        id: Sha1.hash(time * TOKEN + (Math.random() * 100)),
        data: document,
        metadata: {
            create_at: time,
            updated_at: time
        }
    }
}

/*
 * Generate experimental ID to be use az UUID
 * @NOTE: not in use
 */
function experimentalId() {
    return ((+new Date) + Math.random()* 100).toString(32)
}