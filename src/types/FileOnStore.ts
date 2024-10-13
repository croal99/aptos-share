export interface FileOnStore {
    id: string;
    name: string;
    handle: string;
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
