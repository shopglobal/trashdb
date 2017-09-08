// @flow

'use strict'

import type { CollectionDocument, CollectionPaging, CollectionId } from './flow/TrashDbTypes'

import Sha1 from './sha1'

const TOKEN = 37;

/**
 * Create new collection instance 
 * 
 * @class TrashCollectionDb
 * @param {String} name collection name
 */
export default class TrashCollectionDb {
    collection_name: string;
    collection: Map<any,any>;
    constructor(name: string) {
        this.collection_name = name;
        this.collection = new Map();
    }

    /**
     * Convert `Map` object to simple JavaScript Object
     * @param {Map} d 
     * @return {Object}
     */
    toObject(d: any): Object {
        return Object.assign({}, Array.from(d)[0][1]);
    }

    /**
     * Fetch last inserted id into the collection
     * @return {CollectionID}
     */
    lastId(): CollectionId {
        // $FlowFixMe
        return [...this.collection.keys()][this.collection.size - 1]
    }

    /**
     * Check if given `ID` exist into the collection 
     * @param {CollectionId} id 
     * @return {Boolean}
     */
    exist(id: CollectionId): boolean {
        return this.collection.has(id)
    }

    /**
     * Fetch data by Id from the colletion MapObject 
     * @param {CollectionId} id 
     * @return {CollectionDocument}
     */
    fetch(id: CollectionId): CollectionDocument {
        return Object.assign({}, this.collection.get(id))
    }

    /**
     * Single record insert  
     * @param {Any} data 
     * @return {Any}
     * 
     */
    insert(data: any): CollectionDocument {
        const document = newDocument(data)
        this.collection.set(document.id, document)
        return this.fetch(document.id)
    }

    /**
     * Insert multiple records into the colletion 
     * @param {Array} data 
     * @return {Array}
     */
    bulkInsert(data: Array<mixed>): Array<CollectionDocument> {
        return data.map((row) => {
            const document = newDocument(row);
            this.collection.set(document.id, document)
            return this.fetch(document.id);
        })
    }

    /**
     * Update record from the collection by passing ID to locate and overwrite it.
     * @NOTE you must pass the how object or you may lose some of the data into the process 
     * @param {CollectionId} id 
     * @param {Object} data 
     * @return {CollectionDocument}
     */
    update(id: CollectionId, data: CollectionDocument): CollectionDocument {
        let document = this.fetch(id);
        if (document) {
            const updateAt = new Date().getTime() + 1;
            const updated_document = Object.assign(
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
                }
            );

            this.collection.set(document.id, updated_document)
            return this.fetch(document.id)
        }
        return document;
    }

    /**
     * Remove record by `ID` from collection 
     * @param {CollectionId} id 
     * @return {Boolean}
     */
    trash(id: CollectionId): boolean {
        return this.collection.delete(id)
    }

    /**
     * Truncate the collection
     * @return {Void}
     */
    trashAll(): void {
        this.collection.clear();
    }

    /**
     * Return Iterator to iterate from all the `CollectionId`s inserted into 
     * the collection 
     * @return {Array}
     */
    indexes(): Array<CollectionId> {
        // $FlowFixMe
        return [...this.collection.keys()];
    }

    /**
     * Return array of all records from the collection
     * @return {Array}
     */
    records(): Array<CollectionDocument> {
        // $FlowFixMe
        return [...this.collection.values()]
    }

    /**
     * Return the number of records inside the collection
     * @return {Number}
     */
    size(): number {
        return this.collection.size
    }

    /**
     * Create paging to iterate from all the data 
     * @param {Object} options 
     * @param {Number} options.pageSize
     */
    paging(pageNumber: number, pageSize: number): CollectionPaging {
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
function newDocument(document: any): CollectionDocument {
    const time = new Date().valueOf();
    return {
        id: Sha1.hash(time * TOKEN + (Math.random() * 100)),
        data: document,
        metadata: {
            created_at: time,
            updated_at: time
        }
    }
}

/**
 * Generate experimental ID to be use az UUID
 * @NOTE: not in use
 */
function experimentalId(): string {
    return ((+new Date) + Math.random()* 100).toString(32)
}