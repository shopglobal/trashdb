'use strict'

import TrashCollectionDb from './collection'

/**
 * Create single instance of TrashDb 
 * @class TrashDb
 * @params {Object} props
 */
export default class TrashDb {
    constructor(prop = {}) {
        this.db = {}
    }

    /**
     * Access or create a single collection
     *  
     * @param {String} name 
     */
    collection(name) {
        if (!this.db[name]) {
            this.db[name] = new TrashCollectionDb(name)
        } 

        return this.db[name]
    }

    /**
     * All created or accessed collections
     * @return {Array}
     */
    collections() {
        return Object.keys(this.db)
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
    toObject() {
        let result = {};
        Object.keys(this.db).map((collection) => {
            result[collection] = this.db[collection].records();
        })
        return result;
    }
}