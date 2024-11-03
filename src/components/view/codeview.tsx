import {Box, Button, Card, Flex, Text, TextField} from "@radix-ui/themes";
import React, {useState} from "react";
import PreViewImage from "@/components/view/previewimage.tsx";
import {toast, Toaster} from "react-hot-toast";

export default function CodeView(
    {
        shareFile,
    }) {
    const [shareCode, setShareCode] = useState("");
    const [isConfirm, setIsConfirm] = useState(false);

    const checkShareCode = async () => {
        if (shareCode == shareFile.code) {
            // console.log('confirm')
            setIsConfirm(true)
            // await handleDownload(shareFile, true)
        } else {
            toast.error('error code')
        }
    }
    return (
        <>
            {isConfirm ?
                <PreViewImage
                    shareFile={shareFile}
                />
                :
                <Flex direction="column" gap="3" align="center" justify="center">
                    <Card style={{width: '500px'}}>
                        <Flex direction="column" gap="3">
                            <Text>
                                In order to support the author in sharing his wonderful works, please
                                enter the share code to view the pictures.
                            </Text>
                            <TextField.Root
                                style={{width: "100%"}}
                                onChange={event => {
                                    setShareCode(event.target.value)
                                }}
                            />
                            <Button onClick={checkShareCode}>View</Button>
                            <Text size="1" align={'center'}>
                                Version (20241104.1.test)
                            </Text>

                        </Flex>
                    </Card>
                </Flex>
            }
        </>
    )
}