// @flow 

declare class TrashCollectionDb<A> {
    constructor(name: A): void;
    toObject(d: CollectionDocument): CollectionDocument;
    lastId(): string;
    exist(id: CollectionId): boolean;
    fetch(id: CollectionId): CollectionDocument;
    insert(data: any): CollectionDocument;
    bulkInsert(data: Array<any>): Array<CollectionDocument>;
    update(id: CollectionId, data: CollectionDocument): CollectionDocument;
    trash(id: CollectionId): boolean;
    trashAll(): boolean;
    indexes(): Array<CollectionId>;
    records(): Array<CollectionDocument>;
    size(): number;
    paging(pageNumber: number, pageSize: number): CollectionPaging
}

export type TrashDbStorage = {
    [key: string]: Array<TrashCollectionDb<string>>
}

export type TrashDbExport = {
    [key: string]: Array<CollectionDocument>
}

export type CollectionId = string;

export type CollectionDocument = {
    id: CollectionId,
    data: any,
    metadata: {
        created_at: number,
        updated_at: number
    }
}

export type CollectionPaging = {
    page: number,
    pages: number, 
    limit: number,
    total: number,
    records: Array<CollectionDocument> 
}
