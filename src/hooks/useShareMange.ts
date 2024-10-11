import {FileOnChain, IFileInfoOnChain, IStoreOnChain} from "@/types/FileOnChain.ts";
import {Aptos, AptosConfig} from "@aptos-labs/ts-sdk";
import {InputTransactionData, useWallet} from "@aptos-labs/wallet-adapter-react";

// Setup the client
const config = new AptosConfig({network: "devnet"});
const aptos = new Aptos(config);

export const useShareMange = () => {
    const {account, signAndSubmitTransaction} = useWallet();

    const COIN_AMOUNT = 1_00_000_000;

    // 配置信息
    const env = import.meta.env;
    const MARKET_PACKAGE_ID = env.VITE_MARKET_PACKAGE_ID;       // 合约
    const PLAYGROUND_ID = env.VITE_PLAYGROUND_ID;
    const SUI_NETWORK = env.VITE_PUBLIC_SUI_NETWORK;
    const MANAGE_ADDRESS = "0xdcab9a56a3add162ccb00f76d5fc7620fbd6d5f59922c0657398f1b7e5303a0f";

    const handleGetManger = async () => {
        if (!account) return false;
        // console.log("account", account);
        try {
            const listResource = await aptos.getAccountResource(
                {
                    accountAddress: account?.address,
                    resourceType: `${MANAGE_ADDRESS}::sharelist::FileStore`
                }
            );
            // console.log('file store', listResource as IStoreOnChain);
            return listResource as IStoreOnChain
        } catch (err) {
            // console.log('error', err)
            return false;
        }
    }

    const handleCreateManager = async () => {
        const transaction: InputTransactionData = {
            data: {
                function: `${MANAGE_ADDRESS}::sharelist::create_store`,
                functionArguments: []
            }
        }

        try {
            // sign and submit transaction to chain
            const response = await signAndSubmitTransaction(transaction);
            // wait for transaction
            const res = await aptos.waitForTransaction({transactionHash: response.hash});
            console.log('res', res);
        } catch (error) {
            console.log(error);
        }

        return 'fileObjectID';
    }

    const handleAddFile = async (
        filename,
        media,
        hash,
        salt,
        blobId,
        share,
        fee,
        code
    ) => {
        const transaction: InputTransactionData = {
            data: {
                function: `${MANAGE_ADDRESS}::sharelist::add_file`,
                functionArguments: [
                    filename,
                    media,
                    hash,
                    salt,
                    blobId,
                    share,
                    fee,
                    code,
                ]
            }
        }

        try {
            // sign and submit transaction to chain
            const response = await signAndSubmitTransaction(transaction);
            // wait for transaction
            await aptos.waitForTransaction({transactionHash: response.hash});
            // console.log('res', res);
            return true;
        } catch (error) {
            // console.log(error);
            return error
        }
    }

    const handleGetShareFileObject = async (handle: string, id: number) => {
        const tableItem = {
            key_type: "u64",
            value_type: `${MANAGE_ADDRESS}::sharelist::FileInfo`,
            key: `${id}`,
        };
        // console.log(handle, id)
        const fileInfo = await aptos.getTableItem<IFileInfoOnChain>({handle: handle, data: tableItem});

        return fileInfo;

    }

    const handlePayShareView = async (shareFile: FileOnChain) => {
    }

    return {
        COIN_AMOUNT,
        handleGetManger,
        handleCreateManager,
        handleAddFile,
        handleGetShareFileObject,
        handlePayShareView,
    }
}