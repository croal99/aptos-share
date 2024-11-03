import {Badge, Button, Card, Flex, Spinner, Text} from "@radix-ui/themes";
import {ConnectButton, useCurrentAccount, useSignAndExecuteTransaction} from "@mysten/dapp-kit";
import React, {useState} from "react";
import {toast} from "react-hot-toast";
import {amount, signSendWait, Wormhole, wormhole} from '@wormhole-foundation/sdk';
import aptos from '@wormhole-foundation/sdk/aptos';
import sui from "@wormhole-foundation/sdk/sui";
import { getSigner, getEnv } from '@/utils/helpers.ts';

import {Transaction} from "@mysten/sui/transactions";

import {IFileInfoOnChain} from "@/types/FileOnChain.ts";

export default function PaySui({shareFile, setIsConfirm}) {
    const [isLoading, setIsLoading] = useState(false);
    const account = useCurrentAccount();
    const {mutateAsync: signAndExecuteTransaction} = useSignAndExecuteTransaction();

    const handlePaySui = async (shareFile : IFileInfoOnChain) => {
        const receiverAddress = getEnv("RECEIVER_SUI_ADDRESS");
        console.log('receiverAddress', receiverAddress);
        const tb = new Transaction();
        tb.setSender(account?.address);
        const payment = tb.splitCoins(tb.gas, [shareFile.fee]);

        tb.transferObjects(
            [
                payment,
            ],
            tb.pure.address(account?.address),
        );

        // 将PTB签名上链
        const {digest} = await signAndExecuteTransaction({
            transaction: tb,
        });
        // console.log('signAndExecuteTransaction', digest)

        return digest;

    }

    const payWormhole = async () => {
        const wh = await wormhole('Testnet', [
            aptos,
            sui,
        ]);
        console.log(wh);

        const ctx = wh.getChain('Aptos');
        const rcv = wh.getChain('Sui');

        const sender = await getSigner(ctx);
        console.log('sender', sender.address);

        const receiver = await getSigner(rcv);
        console.log('receiver', receiver);

        // Get a Token Bridge contract client on the source
        const sndTb = await ctx.getTokenBridge();
        console.log('snbTb', sndTb);

        // Send the native token of the source chain
        const tokenId = Wormhole.tokenId(ctx.chain, 'native');
        console.log('tokenId', tokenId);

        // Bigint amount using `amount` module
        const amt = amount.units(amount.parse('0.1', ctx.config.nativeTokenDecimals));

        // Create a transaction stream for transfers
        const transfer = sndTb.transfer(
            sender.address.address,
            receiver.address,
            tokenId.address,
            amt
        );
        console.log('transfer', transfer);

        // Sign and send the transaction
        const txids = await signSendWait(ctx, transfer, sender.signer);
        console.log('Sent: ', txids);

        // Get the Wormhole message ID from the transaction
        const [whm] = await ctx.parseTransaction(txids[txids.length - 1]!.txid);
        console.log('Wormhole Messages: ', whm);

        const vaa = await wh.getVaa(
            // Wormhole Message ID
            whm!,
            // Protocol:Payload name to use for decoding the VAA payload
            'TokenBridge:Transfer',
            // Timeout in milliseconds, depending on the chain and network, the VAA may take some time to be available
            60_000
        );

        // Now get the token bridge on the redeem side
        const rcvTb = await rcv.getTokenBridge();

        // Create a transaction stream for redeeming
        const redeem = rcvTb.redeem(receiver.address.address, vaa!);

        // Sign and send the transaction
        const rcvTxids = await signSendWait(rcv, redeem, receiver.signer);
        console.log('Sent: ', rcvTxids);

        // Now check if the transfer is completed according to
        // the destination token bridge
        const finished = await rcvTb.isTransferCompleted(vaa!);
        console.log('Transfer completed: ', finished);
    }

    const pay4View = async () => {
        // return console.log(shareFile)

        setIsLoading(true)

        await handlePaySui(shareFile);

        await payWormhole();

        try {

            setIsConfirm(true)
        } catch (e) {
            toast.error(e)
        }

        // setIsLoading(false)
    }

    return (
        <>
            <ConnectButton/>
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