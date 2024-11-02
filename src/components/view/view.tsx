import {Link, useLoaderData} from "react-router-dom";
import React, {useEffect, useState} from "react";

import {useShareManage} from "@/hooks/useShareManage.ts";
import {IFileInfoOnChain} from "@/types/FileOnChain.ts";
import {Box, Button, Dialog, Flex, Grid, Heading, Spinner} from "@radix-ui/themes";

import PreViewImage from "@/components/view/previewimage.tsx";
import CodeView from "@/components/view/codeview.tsx";
import PayAptos from "@/components/view/payAptos.tsx";
import PaySelect from "@/components/view/paySelect.tsx";
import {Toaster} from "react-hot-toast";

import {ConnectButton, useCurrentAccount} from "@mysten/dapp-kit";

export async function loader({params}) {
    const handle = params.handle;
    const id = params.id;
    return {handle, id};
}

export default function View() {
    const account = useCurrentAccount();
    console.log('account', account);
    const {handle, id} = useLoaderData();
    const [shareFile, setShareFile] = useState<IFileInfoOnChain | boolean>(false);
    const {handleGetShareFileObject} = useShareManage();

    const fetchData = async () => {
        // console.log('fetch data');
        // const fileObject = await handleGetShareFileObject(handle, id);
        // fileObject.share = parseInt(String(fileObject.share))
        // setShareFile(fileObject);
    };

    useEffect(() => {
        fetchData().then(() => {
            // console.log('end fetch');
        });

        return () => {
        }
    }, []);

    // switch (shareFile.share) {
    //     case 0:
    //         return (
    //             <PreViewImage
    //                 shareFile={shareFile}
    //             />
    //         )
    //
    //     case 1:
    //         return (
    //             <CodeView
    //                 shareFile={shareFile}
    //             />
    //         )
    //
    //     case 2:
    //         return (
    //             <PaySelect
    //                 shareFile={shareFile}
    //             />
    //         )
    // }


    return (
        <>
            <Toaster />

            <ConnectButton />
            {/*<div className="flex h-screen flex-col back-ground">*/}
            {/*    <Flex direction="column" gap="4" p="4">*/}
            {/*        <Box>*/}
            {/*            <Grid columns="2" align="center">*/}
            {/*                <Heading>*/}
            {/*                    <Link to="/" style={{textDecoration: 'none'}}>*/}
            {/*                        <img src="/images/logo.png" alt="" style={{height: '50px'}}/>*/}
            {/*                    </Link>*/}
            {/*                </Heading>*/}
            {/*            </Grid>*/}
            {/*        </Box>*/}

            {/*        <Flex>*/}
            {/*        </Flex>*/}

            {/*        {*/}
            {/*            shareFile?.share === 0 ?*/}
            {/*            <PreViewImage*/}
            {/*                shareFile={shareFile}*/}
            {/*            />*/}
            {/*            :*/}
            {/*            null*/}
            {/*        }*/}

            {/*        {*/}
            {/*            shareFile?.share === 2 ?*/}
            {/*            <PaySelect*/}
            {/*                shareFile={shareFile}*/}
            {/*            />*/}
            {/*            :*/}
            {/*            null*/}
            {/*        }*/}

            {/*    </Flex>*/}


            {/*    <Dialog.Root open={shareFile === false}>*/}
            {/*        <Dialog.Content maxWidth="300px">*/}
            {/*            <Dialog.Title><img src="/images/logo.png" alt="" style={{height: '50px'}}/></Dialog.Title>*/}
            {/*            <Dialog.Description></Dialog.Description>*/}

            {/*            <Flex justify="center">*/}
            {/*                <Button>*/}
            {/*                    <Spinner loading></Spinner> Loading...*/}
            {/*                </Button>*/}

            {/*            </Flex>*/}
            {/*        </Dialog.Content>*/}
            {/*    </Dialog.Root>*/}
            {/*</div>*/}
        </>
    )
}