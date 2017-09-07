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


test('export database to object', () => {
    const db = new TrashDb();
    const users = db.collection('users')
    const posts = db.collection('posts')

    users.insert({ firstname: 'john', lastname: 'doe' })
    posts.insert({ title: 'Hello World', content: 'Just a content' })

    const exported = db.toObject();

    expect(exported.users).toBeDefined()
    expect(exported.posts).toBeDefined()
    expect(exported.users).toHaveLength(1)
    expect(exported.posts).toHaveLength(1)
})