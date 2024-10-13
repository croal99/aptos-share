import {Outlet, useLoaderData} from "react-router-dom";
import {getFileByID} from "@/hooks/useFileStore.ts";
import {getSetting} from "@/hooks/useLocalStore.ts";
import React, {useEffect, useState} from "react";
import {getCurrentFolder} from "@/hooks/useFolderStore.ts";
import {useShareManage} from "@/hooks/useShareManage.ts";
import {IFileInfoOnChain} from "@/types/FileOnChain.ts";
import {Box, Button, Card, Flex, Grid, Heading, Spinner, Text, TextField, Dialog} from "@radix-ui/themes";
import BlobImage from "@/components/explorer/blobImage.tsx";
import PreViewImage from "@/components/view/previewimage.tsx";
import CodeView from "@/components/view/codeview.tsx";
import PayView from "@/components/view/payview.tsx";

// import PayView from "@/components/view/payview.tsx";


export async function loader({params}) {
    const handle = params.handle;
    const id = params.id;
    return {handle, id};
}

export default function View() {
    const {handle, id} = useLoaderData();
    const [shareFile, setShareFile] = useState<IFileInfoOnChain>({share: 3});
    const {handleGetShareFileObject} = useShareManage();

    const fetchData = async () => {
        // console.log('fetch data');
        const fileObject = await handleGetShareFileObject(handle, id);
        fileObject.share = parseInt(String(fileObject.share))
        // console.log('share file', fileObject)
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

        case 2:
            return (
                <PayView
                    shareFile={shareFile}
                />
            )
    }


    return (
        <>
            <div className="flex h-screen flex-col back-ground">
                <main className="flex flex-1 justify-center items-center">
                    <Button>
                        <Spinner loading></Spinner> Loading...
                    </Button>
                </main>
            </div>
        </>
    )
}