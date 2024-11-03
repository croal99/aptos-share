import {Box, Card, Flex, Grid, Text} from "@radix-ui/themes";
import {WalletSelector} from "@aptos-labs/wallet-adapter-ant-design";

import {useWallet} from "@aptos-labs/wallet-adapter-react";
import React, {useEffect, useState} from "react";

import "@/styles/globals.css"
import {useShareManage} from "@/hooks/useShareManage.ts";
import {IStoreOnChain} from "@/types/FileOnChain.ts";
import {FileOnStore} from "@/types/FileOnStore.ts";
import {FolderOnStore} from "@/types/FolderOnStore.ts";
import {getChildFiles, removeFileStore} from "@/hooks/useFileStore.ts";
import UploadFile from "@/components/explorer/uploadFile.tsx";
import {getCurrentFolder} from "@/hooks/useFolderStore.ts";
import Explorer from "@/components/explorer/explorer.tsx";

export default function Home() {
    const {account} = useWallet();

    const [uploadStep, setUploadStep] = useState(0);
    const [fileList, setFileList] = useState<FileOnStore[]>([]);
    const [folderList, setFolderList] = useState<FolderOnStore[]>([]);
    const [root, setRoot] = useState<FolderOnStore>();

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
    };

    useEffect(() => {
        if (!account) {
            return () => {
            }
        }
        fetchData().then(() => {
            console.log('end fetch');
        });

        return () => {
        }
    }, [account]);

    if (account) {
        return (
            <>
                <div className="back-ground h-screen">
                    <Flex direction="column" gap="3" p="4">
                        <Box>
                            <Grid columns="2" align="center">
                                <img src="/images/logo.png" alt="" style={{height: '50px'}}/>
                                <Flex justify="end">
                                    <WalletSelector/>
                                </Flex>
                            </Grid>
                        </Box>

                        <Flex gap="3">
                            <UploadFile
                                root={root}
                                reFetchDir={fetchData}
                                uploadStep={uploadStep}
                            />
                        </Flex>

                        <Explorer
                            folders={folderList}
                            files={fileList}
                            removeFolder={removeFolder}
                            removeFile={removeFile}
                            reFetch={fetchData}
                        />

                    </Flex>

                </div>
            </>
        );
    }

    return (
        <>
            <Box className="back-ground h-screen login-container">
                <Flex direction="column" gap="3">
                    <Card className="login-form">
                        <Flex direction="column" gap="3">
                            <Text as="div" weight="bold" size="3" mb="1" align={'center'}>
                                <img src="/images/logo.png" alt="" style={{height: '50px'}}/>
                            </Text>
                            <Text>
                                Aptos Share is a file sharing app based on the Walrus protocol.
                            </Text>
                            <Text>
                                Aptos Share app can not only provide Walrus-based distributed storage, but also verify
                                the sharing permissions of files.
                            </Text>
                            <Text>
                                This ensures that the original file owner can gain benefits from file sharing.
                            </Text>
                            <Text weight="bold" color="orange">
                                Since this is a testing phase, please switch your Network to Testnet!
                            </Text>

                            <Text size="1" mb="1" align={'center'}>
                                Version (20241104.1.test)
                            </Text>

                            <WalletSelector/>
                        </Flex>
                    </Card>
                </Flex>
            </Box>
        </>
    )

}