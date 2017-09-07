#### TrashDB
Small in memory database used for easy data managment without the need of complex setup. The database is based on the JavaScript `Map` class.
The objects returned from `insert` & `update` are of type `Map` and they are iteratable 

```js
Map {
    'id-of-the-record': {
        id: 'id-of-the-record',
        data: { /* whatever */ },
        metadata: {
            create_at: <timestamp>,
            updated_at: <timestamp>
        }
    }
}
```

#### Installation
You could use Yarn or NPM to install it

```bash
// Yarn
yard add trashdb

// NPM
npm install --save trashdb
```

#### Quick Start

```js
// Normall require 
const TrashDb = require('trashdb')
// ES6 Imports

import TrashDb from 'trashdb'

const db = new TrashDb();

// Create collection/namespace to hold the data 
const users = db.collection('users')

// Insert data into collection
users.insert({ firstname: 'John', email: 'john@email.com' })

// Get last inserted id
johnId = users.lastId();

// Get data from collection

const john = users.fetch(johnId);

// => { id: 'xxxxx', data: { firstname: 'John', email: 'john@email.com' }, metadata: { created_at: <timestamp>, updated_at: <timestamp> } }

// Update data from collection

john.data.firstname = 'Mike';

// Check to see if some ID exist
if (users.exist(john.id)) {
    // John exist
} 

const result = users.update(john.id, john)

if (result === false) {
    // The record is not updated or not existing
} else {
    // Updated Map instance of the record
}

// To use the object returned from `insert`, `update` use `toObject` method
const updatedJohn = users.toObject(result)

// Count how many records you have
users.size()
// => 1

// List of all ids into the collection
users.indexes.map((id) => console.log(id))

// Remove data
users.trash(updatedJohn.id)

// Remove all data
users.trashAll()

// Use paging
const paging = users.paging(1, 15)

// => {
//  page: 1,
//  pages: 4,
//  limit: 15,
//  total: 60,
//  records: [ <UserRecords> ... ]
// } 


```

#### API

##### TrashDb constructor
To create new database instance.

##### TrashDb.collection
Access or create new collection - all collection will be create for the first time that they are accessed the same way like MongoDb will create it's own collection. No need to defined them at start only when you need to start fetching/inserting data to them.

```js
```

##### TrashDb.collections
List of all already accessed or created collections. Usefull when you need to know where and what data you have in given instance.

##### TrashCollectionDb.constructor
##### TrashCollectionDb.toObject
##### TrashCollectionDb.lastId
##### TrashCollectionDb.exist
##### TrashCollectionDb.fetch
##### TrashCollectionDb.insert
##### TrashCollectionDb.update
##### TrashCollectionDb.trash
##### TrashCollectionDb.trashAll
##### TrashCollectionDb.indexes
##### TrashCollectionDb.size
##### TrashCollectionDb.paging
