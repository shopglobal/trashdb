'use strict'

import TrashCollectionDb from './collection'

export default class TrashDb {
    constructor(prop = {}) {
        this.db = {}
    }

    collection(name) {
        if (!this.db[name]) {
            this.db[name] = new TrashCollectionDb(name)
        } 

        return this.db[name]
    }

    collections() {
        return Object.keys(this.db)
    }
}