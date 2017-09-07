import TrashDb from '../src'

let db, col, newDoc;

beforeEach(() => {
    db = new TrashDb()
    col = db.collection('users')
    newDoc = { username: 'demo', password: 'demo'}
})

afterAll(() => {
    col.clear()
})

test('insert', () => {
    expect(col.size()).toBe(0)
    const doc = col.insert(newDoc)
    expect(col.lastId()).toBeDefined()
    expect(col.size()).toBe(1)
})

test('insert bulk', () => {
    col.bulkInsert([ newDoc, newDoc ])
    expect(col.size()).toBe(2)
})

test('fetch', () => {
    const pdoc = col.insert(newDoc)
    const ndoc = col.fetch(pdoc.id) 
    expect(pdoc).toEqual(ndoc)
})

test('update', () => {
    // Insert 
    const doc = col.insert(newDoc)
    // Update 
    const doc2 = col.update(doc.id, Object.assign({}, doc, { data: { username: 'unknown' }}))
    expect(doc2.data.username).toBe('unknown')
    expect(doc.metadata.updated_at).not.toBe(doc2.metadata.updated_at)
})

test('has id', () => {
    const doc = col.insert(newDoc)
    expect(col.exist(doc.id)).toBeTruthy()
    expect(col.exist('not-existing')).toBeFalsy()
})

test('remove id', () => {
    const doc = col.insert(newDoc)
    col.trash(doc.id)
    expect(col.exist(doc.id)).toBeFalsy();
})

test('paging', () => {
    col.bulkInsert((new Array(30).fill('UserObject')))
    
    /* First page */
    const page1 = col.paging(1,10);
    expect(page1.records.length).toBe(10)
    expect(page1).toMatchObject({
        page: 1,
        pages: 3,
        limit: 10,
        total: 30,
    })

    /* Second page */
    const page2 = col.paging(2, 10);
    expect(page2.records.length).toBe(10)
    expect(page2).toMatchObject({
        page: 2,
        pages: 3,
        limit: 10,
        total: 30
    })
})

test('records', () => {
    col.insert({ name: 'A' })
    col.insert({ name: 'B' })
    col.insert({ name: 'C' })

    expect(col.records()).toHaveLength(3)
})