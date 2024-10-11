import {Outlet, useLoaderData} from "react-router-dom";
import {getFileByID} from "@/hooks/useFileStore.ts";
import {getSetting} from "@/hooks/useLocalStore.ts";
import React, {useEffect, useState} from "react";
import {getCurrentFolder} from "@/hooks/useFolderStore.ts";
import {useShareMange} from "@/hooks/useShareMange.ts";
import {FileOnChain} from "@/types/FileOnChain.ts";
import {Box, Button, Card, Flex, Grid, Heading, Spinner, Text, TextField, Dialog} from "@radix-ui/themes";
import BlobImage from "@/components/explorer/blobImage.tsx";
import PreViewImage from "@/components/view/previewimage.tsx";
import CodeView from "@/components/view/codeview.tsx";

// import PayView from "@/components/view/payview.tsx";

export async function loader({params}) {
    const handle = params.handle;
    const id = params.id;
    return {handle, id};
}

export default function View() {
    const [shareFile, setShareFile] = useState<FileOnChain>({share: 3});

    const {handle, id} = useLoaderData();
    const {handleGetShareFileObject} = useShareMange();

    const fetchData = async () => {
        // console.log('fetch data');
        const fileObject = await handleGetShareFileObject(handle, id);
        fileObject.share = parseInt(String(fileObject.share))
        console.log('share file', fileObject)
        setShareFile(fileObject);
    };

    useEffect(() => {
        fetchData().then(() => {
            // console.log('end fetch');
        });

        return () => {
        }
    }, []);

    switch (shareFile.share) {
        case 0:
            return (
                <PreViewImage
                    shareFile={shareFile}
                />
            )

        case 1:
            return (
                <CodeView
                    shareFile={shareFile}
                />
            )

        // case 2:
        //     return (
        //         <PayView
        //             shareFile={shareFile}
        //         />
        //     )
    }


    return (
        <>
            <div className="back-ground h-screen">
                <Flex className="preview-container" gap="4">
                    <Button>
                        <Spinner loading></Spinner> Loading...
                    </Button>
                </Flex>
            </div>
        </>
    )
}