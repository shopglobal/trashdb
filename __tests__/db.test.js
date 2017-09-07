import TrashDb from '../src/index'
import TrashCollectionDb from '../src/collection'


test('init the database', () => {
    const db = new TrashDb();
    expect(db).toBeDefined();
})

test('create new collection', () => {
    const db = new TrashDb()
    const col = db.collection('users')
    expect(col).toBeInstanceOf(TrashCollectionDb)
    expect(col.collection_name).toBe('users')
})

test('list collections', () => {
    const db = new TrashDb();
    db.collection('users')
    db.collection('channels')

    expect(['users', 'channels'])
        .toEqual(expect.arrayContaining(db.collections()))
})

test('access the same collection every time', () => {
    const db = new TrashDb();
    const john = db.collection('users').insert({ username: 'John' })
    const john2 = db.collection('users').fetch(john.id)
    expect(john).toEqual(john2)
})