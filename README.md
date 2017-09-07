#### TrashDB
Small in memory database used for easy data managment without the need of complex setup. The database is based on the JavaScript `Map` class.

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

// Bulk insert
users.bulkInsert([ { firstname: 'Mike' }, { firstname: 'Sam' } ])

users.size()
// => 3

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
    // Updated record
}

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