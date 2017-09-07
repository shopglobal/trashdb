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
        return Array.from(d)[0][1]
    }

    /**
     * Fetch last inserted id into the collection
     * @return {CollectionID}
     */
    lastId() {
        return Array.from(this.collection.keys())[0][this.collection.size]
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
     * @return {Map}
     */
    fetch(id) {
        return this.collection.get(id)
    }

    /**
     * Insert data into collection by passing Single object or Array of objects 
     * @param {Array|Object} data 
     * @param {Boolean} bulk 
     * @return {Map|[Map]}
     * 
     */
    insert(data, bulk = false) {
        if (!bulk) {
            data = [data]
        }
        const inserts = data.map((row) => {
            const document = newDocument(row)
            return this.collection.set(document.id, document)
        })
        return inserts.length === 1 ? inserts[0] : inserts
    }

    /**
     * Update record from the collection by passing ID to locate and overwrite it.
     * @NOTE you must pass the how object or you may lose some of the data into the process 
     * @param {CollectionId} id 
     * @param {Object} data 
     * @return {Map|Boolean}
     */
    update(id, data) {
        let document = this.fetch(id);
        if (document) {
            document = Object.assign({}, document, data);
            document.metadata.updated_at = new Date().valueOf() + 10 
            return this.collection.set(document.id, document)
        }
        return false
    }

    /**
     * Remove record by `ID` from collection 
     * @param {CollectionId} id 
     */
    trash(id) {
        return this.collection.delete(id)
    }

    /**
     * Truncate the collection
     */
    trashAll() {
        return this.collection.clear()
    }

    /**
     * Return Iterator to iterate from all the `CollectionId`s inserted into 
     * the collection 
     * @return {Iterator[CollectionId]}
     */
    indexes() {
        return this.collection.keys();
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

function experimentalId() {
    return ((+new Date) + Math.random()* 100).toString(32)
}