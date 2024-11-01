import {PetraWallet} from "petra-plugin-wallet-adapter";
import {AptosWalletAdapterProvider} from "@aptos-labs/wallet-adapter-react";
import Home from "@/components/home/home.tsx";

const wallets = [new PetraWallet()];

export default function App() {

    return (
        <>
            <AptosWalletAdapterProvider plugins={wallets} autoConnect={true}>
                <Home />
            </AptosWalletAdapterProvider>
        </>
    )
}
