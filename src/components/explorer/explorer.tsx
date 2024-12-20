import React, {useEffect, useState} from "react";
import {
    Box,
    Button,
    Card,
    Flex,
    Text,
    Dialog,
    TextField,
    Table,
    Inset,
    Strong,
    Spinner,
    Select,
    Grid, Radio, Badge, Code, Blockquote
} from "@radix-ui/themes";
import {
    createFile,
    getChildFiles,
    removeFileStore, updateFileStore
} from "@/hooks/useFileStore.ts";
import dayjs from "dayjs";
import copy from "copy-to-clipboard";
import {toast, Toaster} from "react-hot-toast";

import type {FolderOnStore} from "@/types/FolderOnStore.ts";
import type {FileOnStore} from "@/types/FileOnStore.ts";
import Detail from "@/components/explorer/detail.tsx";

import {humanFileSize} from "@/utils/formatSize.ts";
import {useShareManage} from "@/hooks/useShareManage.ts";
import {useWallet} from "@aptos-labs/wallet-adapter-react";
import {useNavigate} from "react-router-dom";


export default function Explorer(
    {
        folders,
        files,
        removeFolder,
        removeFile,
        reFetch,
    }) {
    const [fileList, setFileList] = useState<FileOnStore[]>([]);
    const [folderList, setFolderList] = useState<FolderOnStore[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [step, setStep] = useState(0);
    const [shareType, setShareType] = useState(0);
    const [shareFee, setShareFee] = useState("");
    const [shareURL, setShareURL] = useState("");
    const [currentFile, setCurrentFile] = useState<FileOnStore>({});
    const [shareDescritioin, setShareDescritioin] = useState('');

    const {account} = useWallet();
    const navigate = useNavigate();
    const {COIN_AMOUNT, handleAddFile, handleGetManger} = useShareManage();

    const storeOnChain = async () => {
        // return console.log('storeOnChain', currentFile);
        setIsLoading(true);

        try {
            // console.log('store on chain', currentFile);
            const res = await handleAddFile(
                currentFile.name,
                currentFile.mediaType,
                currentFile.password,
                currentFile.salt,
                currentFile.blobId,
                currentFile.share,
                currentFile.fee,
                currentFile.code,
            )
            if (res === true) {
                const manager = await handleGetManger();
                currentFile.handle = manager.files.handle.substring(2);
                await updateFileStore(currentFile);
                reFetch();

                await showShareLink(currentFile)
            } else {
                toast.error(res);
            }
        } catch (e) {
            alert(e)
        }
        setIsLoading(false)
    }

    const showShareLink = async (fileInfo: FileOnStore) => {
        // console.log('share', fileInfo, storeManage)
        let baseUrl = window.location.href.split('#')[0]
        setShareURL(`${baseUrl}#/view/${fileInfo.handle}/${fileInfo.blobId}`)
        // setShareURL(`${baseUrl}view/${fileInfo.handle}/${fileInfo.blobId}`)

        switch (fileInfo.share) {
            case 0:
                setShareDescritioin("It's Free. Anyone can view the files you share.");
                break;
            case 1:
                setShareDescritioin("Users use the sharing code to view the files you share.");
                break;
            case 2:
                setShareDescritioin("Users need to pay COIN to view the files you share.");
                break;
        }
        setCurrentFile(fileInfo)
        setStep(2)
    }

    useEffect(() => {
        setFolderList(folders)

    }, [folders]);

    useEffect(() => {
        setFileList(files)

    }, [files]);

    useEffect(() => {
        if (!account) {
            navigate('/login', {replace: true});
        }
    }, [account]);

    return (
        <>
            <Flex gap="3" direction="column">
                <Toaster />
                <Card style={{background: 'var(--gray-a6)'}}>
                    <Table.Root>
                        <Table.Header>
                            <Table.Row>
                                <Table.ColumnHeaderCell>Name</Table.ColumnHeaderCell>
                                <Table.ColumnHeaderCell>Create</Table.ColumnHeaderCell>
                                <Table.ColumnHeaderCell>Size</Table.ColumnHeaderCell>
                                <Table.ColumnHeaderCell></Table.ColumnHeaderCell>
                            </Table.Row>
                        </Table.Header>

                        <Table.Body>
                            {folderList.map((item, index) => (
                                <Table.Row key={index} align="center">
                                    <Table.RowHeaderCell>
                                        <Flex align="center">
                                            <img src='/images/folder.png' alt="" style={{height: '32px'}}/>
                                        </Flex>
                                    </Table.RowHeaderCell>
                                    <Table.Cell>
                                        {dayjs(item.createAt).format('YYYY/MM/DD')}
                                    </Table.Cell>
                                    <Table.Cell></Table.Cell>
                                    <Table.Cell>
                                        <Dialog.Root>
                                            <Dialog.Trigger>
                                                <Button color="red">Delete</Button>
                                            </Dialog.Trigger>

                                            <Dialog.Content maxWidth="450px">
                                                <Dialog.Title>Delete Folder</Dialog.Title>
                                                <Dialog.Description size="2" mb="4">
                                                </Dialog.Description>

                                                <Flex direction="column" gap="3">
                                                    <Text size="3">
                                                        Are you sure you want to delete the folder:
                                                    </Text>
                                                    <Text size="3" mb="1" weight="bold">
                                                        <Strong>{item.name}</Strong>
                                                    </Text>

                                                </Flex>

                                                <Flex gap="3" mt="4" justify="end">
                                                    <Dialog.Close>
                                                        <Button variant="soft" color="gray">
                                                            Cancel
                                                        </Button>
                                                    </Dialog.Close>
                                                    <Dialog.Close>
                                                        <Button color="red"
                                                                onClick={() => removeFolder(item)}>
                                                            Delete
                                                        </Button>
                                                    </Dialog.Close>
                                                </Flex>
                                            </Dialog.Content>
                                        </Dialog.Root>

                                    </Table.Cell>
                                </Table.Row>
                            ))}

                            {fileList.map((item, index) => (
                                <Table.Row key={index} align="center">
                                    <Table.RowHeaderCell>
                                        <Flex align="center" gap="2">
                                            <img src={`/images/${item.icon}`} alt="" style={{height: '32px'}}/>
                                            {item.name}
                                        </Flex>
                                    </Table.RowHeaderCell>
                                    <Table.Cell
                                        style={{width: 250}}>{dayjs(item.createAt).format('YYYY/MM/DD HH:mm:ss')}</Table.Cell>
                                    <Table.Cell style={{width: 150}}>{humanFileSize(item.size)}</Table.Cell>
                                    <Table.Cell style={{width: 100}}>
                                        <Flex gap="3">
                                            <Dialog.Root>
                                                <Dialog.Trigger>
                                                    <Button color="red" style={{width: 75}}>Delete</Button>
                                                </Dialog.Trigger>

                                                <Dialog.Content maxWidth="450px">
                                                    <Dialog.Title>Delete File</Dialog.Title>
                                                    <Dialog.Description size="2" mb="4">
                                                    </Dialog.Description>

                                                    <Flex direction="column" gap="3">
                                                        <Text size="3">
                                                            Are you sure you want to delete the file:
                                                        </Text>
                                                        <Text size="3" mb="1" weight="bold">
                                                            <Strong>{item.name}</Strong>
                                                        </Text>

                                                    </Flex>

                                                    <Flex gap="3" mt="4" justify="end">
                                                        <Dialog.Close>
                                                            <Button variant="soft" color="gray">
                                                                Cancel
                                                            </Button>
                                                        </Dialog.Close>
                                                        <Dialog.Close>
                                                            <Button color="red"
                                                                    onClick={() => removeFile(item)}>
                                                                Delete
                                                            </Button>
                                                        </Dialog.Close>
                                                    </Flex>
                                                </Dialog.Content>
                                            </Dialog.Root>

                                            <Detail
                                                walrusFile={item}
                                            />

                                            {item.handle == "" ?
                                                <Button color="blue" style={{width: 75}}
                                                        onClick={() => {
                                                            // 因为是初始化文件，所以所有file的share=0
                                                            item.share = 0;
                                                            setCurrentFile(item);
                                                            setShareType(0);
                                                            setStep(1);
                                                        }}>Protect
                                                </Button> :
                                                <Button
                                                    color="green"
                                                    style={{width: 75}}
                                                    onClick={() => {
                                                        showShareLink(item)
                                                    }}
                                                >
                                                    Link
                                                </Button>}

                                        </Flex>


                                    </Table.Cell>
                                </Table.Row>
                            ))}

                        </Table.Body>
                    </Table.Root>

                </Card>
            </Flex>

            <Dialog.Root open={step == 1}>
                <Dialog.Content maxWidth="500px">
                    <Dialog.Title>Protect file with Aptos Share Contract</Dialog.Title>
                    <Dialog.Description>
                    </Dialog.Description>

                    <Flex direction="column" gap="3">
                        <Text>
                            You need to choose how you want to share the file through the Aptos Share application.
                        </Text>
                        <Text>
                            When a user views the file you shared, the user will pay or unlock it according to the
                            sharing method you set.
                        </Text>
                        <Text weight="bold" color="orange">
                            Since this is a testing phase, please switch your Network to Testnet!
                        </Text>
                        <Text size="4" weight="bold">Select share method</Text>
                        <Card>
                            <Grid columns="2" gap="3">
                                <Flex gap="2" align="center">
                                    <Radio name="shareType" value="0" defaultChecked disabled={isLoading}
                                           onChange={event => {
                                               currentFile.share = parseInt(event.target.value);
                                               currentFile.code = '';
                                               currentFile.fee = 0;
                                               setShareFee("");
                                               setShareType(currentFile.share);
                                               setCurrentFile(currentFile);
                                           }}/>
                                    <Text as="label" size="2">Free</Text>
                                </Flex>
                                <Flex>
                                </Flex>

                                <Flex gap="2" align="center">
                                    <Radio name="shareType" value="1" disabled={isLoading}
                                           onChange={event => {
                                               currentFile.share = parseInt(event.target.value);
                                               currentFile.code = Math.random().toString(36).substring(2, 6);
                                               currentFile.fee = 0;
                                               setShareFee("");
                                               setShareType(currentFile.share);
                                               setCurrentFile(currentFile)
                                           }}/>
                                    <Text as="label" size="2">Code</Text>
                                </Flex>
                                <Flex>
                                    <TextField.Root
                                        disabled={(shareType != 1) || isLoading}
                                        defaultValue={currentFile.code}
                                        onChange={event => {
                                            currentFile.code = event.target.value
                                        }}
                                    />
                                </Flex>

                                <Flex gap="2" align="center">
                                    <Radio name="shareType" value="2" disabled={isLoading}
                                           onChange={event => {
                                               currentFile.share = parseInt(event.target.value);
                                               currentFile.code = '';
                                               currentFile.fee = 0.1 * COIN_AMOUNT;
                                               setShareFee("0.1");
                                               setShareType(currentFile.share);
                                               setCurrentFile(currentFile);
                                           }}
                                    />
                                    <Text as="label" size="2">Pay</Text>
                                </Flex>
                                <Flex align="center" gap="2">
                                    <TextField.Root
                                        disabled={(shareType != 2) || isLoading}
                                        defaultValue={shareFee}
                                        onChange={event => {
                                            currentFile.code = ''
                                            currentFile.fee = parseFloat(event.target.value) * COIN_AMOUNT
                                        }}
                                    />Coin
                                </Flex>
                            </Grid>


                        </Card>

                        {isLoading ?
                            <Button>
                                <Spinner loading></Spinner> Waiting Aptos NET response.
                            </Button> :
                            <Flex gap="3" mt="4" justify="end">
                                <Button onClick={() => {
                                    setStep(0)
                                }}>Close</Button>
                                <Button
                                    onClick={() => storeOnChain()}
                                    color="red"
                                    style={{width: 70}}
                                >
                                    Publish
                                </Button>
                            </Flex>
                        }
                    </Flex>

                </Dialog.Content>
            </Dialog.Root>

            <Dialog.Root open={step == 2}>
                <Dialog.Content maxWidth="550px">
                    <Dialog.Title>Share info of "{currentFile.name}"</Dialog.Title>
                    <Dialog.Description>
                    </Dialog.Description>

                    <Flex direction="column" gap="3">
                        <Flex gap="3"></Flex>
                        <Text>Share URL</Text>
                        <Card>
                            {shareURL}
                        </Card>
                        <Text>Share Type</Text>
                        <Text>{shareDescritioin}</Text>
                        {currentFile.share==1?
                            <Flex align="center" gap="3">
                                <Text>Share Code</Text>
                                <Button>{currentFile.code}</Button>
                            </Flex>:null
                        }
                        {currentFile.share==2?
                            <Flex align="center" gap="3">
                                <Text>Payment</Text>
                                <Button>{(currentFile.fee / COIN_AMOUNT).toString()}</Button>
                                <Text>COIN</Text>
                            </Flex>:null
                        }
                        <Flex gap="3"></Flex>
                        <Flex direction="column" gap="3">
                            <Button
                                onClick={() => {
                                    copy(shareURL);
                                    toast.success('Link copied');
                                    setStep(0)
                                }}
                            >
                                Copy link
                            </Button>
                            <Button variant="surface"
                                onClick={() => {
                                    setStep(0)
                                }}
                            >
                                Close
                            </Button>
                        </Flex>
                    </Flex>

                </Dialog.Content>
            </Dialog.Root>

        </>
    );
}

