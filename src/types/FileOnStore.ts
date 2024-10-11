export interface FileOnStore {
    id: string;
    name: string;
    item: {
        handle: string;
        id: number;
    };
    blobId: string;
    mediaType: string;
    icon: string;
    size: number;
    parentId: string;
    password: string;
    salt: string;
    share: number;
    fee: number;
    code: string;
    createAt: number;
}
