import {Box, Button, Card, Flex, Grid, Heading, Text} from "@radix-ui/themes";
import {useEffect, useState} from "react";
import {FolderOnStore} from "@/types/FolderOnStore.ts";
import {FileOnStore} from "@/types/FileOnStore.ts";
import {getChildFiles, getFilesByType, removeFileStore} from "@/hooks/useFileStore.ts";
import Explorer from "@/components/explorer/explorer.tsx";
import {getCurrentFolder} from "@/hooks/useFolderStore.ts";
import UploadFile from "@/components/explorer/uploadFile.tsx";
import {useShareManage} from "@/hooks/useShareManage.ts";
import {useWallet} from "@aptos-labs/wallet-adapter-react";
import {IStoreOnChain} from "@/types/FileOnChain.ts";

export default function App() {
    const {account} = useWallet();
    // console.log('app address', account?.address)
    const {handleGetManger, handleCreateManager, handleGetShareFileObject} = useShareManage();

    const [isSignIn, setIsSignIn] = useState(false);
    const [uploadStep, setUploadStep] = useState(0);
    const [fileStore, setFileStore] = useState<IStoreOnChain | boolean>(false);
    const [fileList, setFileList] = useState<FileOnStore[]>([]);
    const [folderList, setFolderList] = useState<FolderOnStore[]>([]);
    const [root, setRoot] = useState<FolderOnStore>();

    const handleSuccess = (result) => {
        console.log('success', result)
    }

    const handleError = (result) => {
        console.log('error', result)
    }

    const removeFolder = async (folderInfo: FolderOnStore) => {
    }

    const removeFile = async (fileInfo: FileOnStore) => {
        await removeFileStore(fileInfo);
        await fetchFiles("0");
    }

    const fetchFiles = async (parentId) => {
        const list = await getChildFiles(parentId)
        setFileList(list);
    }

    const fetchData = async () => {
        // console.log('fetch data');
        const path = await getCurrentFolder("");
        await fetchFiles("0")
        setRoot(path)
        const manager = await handleGetManger()
        setFileStore(manager);
    };

    useEffect(() => {
        if (!account) {
            setIsSignIn(false)
            return () => {
            }
        }
        fetchData().then(() => {
            console.log('end fetch');
        });

        return () => {
        }
    }, [account]);

    return (
        <>
            <Flex direction="column" gap="3">
                <Flex gap="3">
                    {fileStore ?
                        <UploadFile
                            root={root}
                            reFetchDir={fetchData}
                            uploadStep={uploadStep}
                        />
                        :
                        <Button
                            onClick={async ()=>{
                                await handleCreateManager();
                                const manager = await handleGetManger()
                                setFileStore(manager);
                            }}
                        >
                            Init contract
                        </Button>
                    }

                </Flex>
                <Explorer
                    storeManage={fileStore}
                    folders={folderList}
                    files={fileList}
                    removeFolder={removeFolder}
                    removeFile={removeFile}
                    reFetch={fetchData}
                />
            </Flex>
        </>
    )
}
