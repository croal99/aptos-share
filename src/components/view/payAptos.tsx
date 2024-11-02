import {Badge, Blockquote, Box, Button, Card, Flex, Spinner, Text, TextField} from "@radix-ui/themes";
import React, {useState} from "react";
import PreViewImage from "@/components/view/previewimage.tsx";
import {useShareManage} from "@/hooks/useShareManage.ts";
import {WalletSelector} from "@aptos-labs/wallet-adapter-ant-design";
import {useWallet} from "@aptos-labs/wallet-adapter-react";
import {IFileInfoOnChain} from "@/types/FileOnChain.ts";
import {toast} from "react-hot-toast";


export default function PayAptos({shareFile, setIsConfirm}) {
    const [isLoading, setIsLoading] = useState(false);

    const {handlePayShareView} = useShareManage();
    const {account} = useWallet();

    const pay4View = async () => {
        // return console.log(shareFile)

        setIsLoading(true)

        try {
            await handlePayShareView(shareFile);
            setIsConfirm(true)
        } catch (e) {
            toast.error(e)
        }

        setIsLoading(false)
    }

    return (
        <>
            <WalletSelector/>
            {account ?
                isLoading ?
                    <Button>
                        <Spinner loading></Spinner> Waiting...
                    </Button>
                    :
                    <Button onClick={pay4View}>
                        Pay for view
                    </Button>
                :
                null
            }

        </>
    )
}