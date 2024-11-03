import {Badge, Box, Card, Flex, RadioGroup, Text} from "@radix-ui/themes";
import {useState} from "react";
import {IFileInfoOnChain} from "@/types/FileOnChain.ts";

import {PetraWallet} from "petra-plugin-wallet-adapter";
import {AptosWalletAdapterProvider} from "@aptos-labs/wallet-adapter-react";

import {createNetworkConfig, SuiClientProvider, WalletProvider} from '@mysten/dapp-kit';
import {getFullnodeUrl} from '@mysten/sui/client';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {darkTheme} from "@/styles/mytheme.ts";
import '@mysten/dapp-kit/dist/index.css';


import PaySui from "@/components/view/paySui.tsx";
import PayAptos from "@/components/view/payAptos.tsx";
import PreViewImage from "@/components/view/previewimage.tsx";
import {useShareManage} from "@/hooks/useShareManage.ts";

// Aptos Wallet
const wallets = [new PetraWallet()];

// Sui Wallet
const {networkConfig} = createNetworkConfig({
    localnet: {url: getFullnodeUrl('localnet')},
    testnet: {url: getFullnodeUrl('testnet')},
    mainnet: {url: getFullnodeUrl('mainnet')},
});
const queryClient = new QueryClient();

export default function PaySelect({shareFile}: { shareFile: IFileInfoOnChain }) {
    const [payType, setPayType] = useState(0);
    const [isConfirm, setIsConfirm] = useState(false);
    const {COIN_AMOUNT} = useShareManage();

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
                            <Text as="div" weight="bold" size="3" mb="1" align={'center'}>
                                <img src="/images/logo.png" alt="" style={{height: '50px'}}/>
                            </Text>
                            <Text>
                                In order to support the author in sharing his wonderful works, please
                                pay <Badge variant="solid" color="orange" size="3">{(shareFile.fee / COIN_AMOUNT).toString()}</Badge> COIN to
                                view the pictures.
                            </Text>
                            <Text weight="bold" color="orange">
                                Since this is a testing phase, please switch your Network to Testnet!
                            </Text>

                            <RadioGroup.Root defaultValue="1">
                                <RadioGroup.Item
                                    value="aptos"
                                    onClick={event => {
                                        console.log('paySelect', event);
                                        setPayType(1);
                                    }}>
                                    Aptos
                                </RadioGroup.Item>
                                <RadioGroup.Item
                                    value="sui"
                                    onClick={event => {
                                        console.log('paySelect', event);
                                        setPayType(2);
                                    }}>
                                    Sui(with WormHole)
                                </RadioGroup.Item>
                            </RadioGroup.Root>

                            {payType === 1 ?
                                <AptosWalletAdapterProvider plugins={wallets} autoConnect={false}>
                                    <PayAptos
                                        shareFile={shareFile}
                                        setIsConfirm={setIsConfirm}
                                    />
                                </AptosWalletAdapterProvider>
                                :
                                null
                            }

                            {payType === 2 ?
                                <QueryClientProvider client={queryClient}>
                                    <SuiClientProvider networks={networkConfig} defaultNetwork="testnet">
                                        <WalletProvider theme={darkTheme}>
                                            <PaySui
                                                shareFile={shareFile}
                                                setIsConfirm={setIsConfirm}
                                            />
                                        </WalletProvider>
                                    </SuiClientProvider>
                                </QueryClientProvider>
                                :
                                null
                            }


                            <Text size="1" align={'center'}>
                                Version (20241004.test)
                            </Text>

                        </Flex>
                    </Card>
                </Flex>
            }
        </>
    )
}