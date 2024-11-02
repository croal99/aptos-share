import ReactDOM from "react-dom/client";
import {Theme} from "@radix-ui/themes";
import {createBrowserRouter, createHashRouter, RouterProvider} from "react-router-dom";

// import App from "@/App.tsx";
import View, {loader as viewLoader} from "@/components/view/view.tsx";

import "@radix-ui/themes/styles.css";
// import "@aptos-labs/wallet-adapter-ant-design/dist/index.css";
import "@/index.css";

import {createNetworkConfig, SuiClientProvider, WalletProvider} from '@mysten/dapp-kit';
import {getFullnodeUrl} from '@mysten/sui/client';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {darkTheme} from "@/styles/mytheme.ts";
import '@mysten/dapp-kit/dist/index.css';
import Test from "@/components/home/test.tsx";

// Sui Wallet
const {networkConfig} = createNetworkConfig({
    localnet: {url: getFullnodeUrl('localnet')},
    testnet: {url: getFullnodeUrl('testnet')},
    mainnet: {url: getFullnodeUrl('mainnet')},
});
const queryClient = new QueryClient();

const router = createHashRouter([
// const router = createBrowserRouter([
        {
            id: "root",
            path: "/",
            Component: Test,
        },
//         {
//             path: "/view/:handle/:id",
//             Component: View,
//             loader: viewLoader,
//         },
    ]
);


ReactDOM.createRoot(document.getElementById("root")!).render(
    // <React.StrictMode>
    <Theme
        appearance="light"
        accentColor="amber"
        panelBackground="solid"
        scaling="100%"
        radius="full"
    >
        <QueryClientProvider client={queryClient}>
            <SuiClientProvider networks={networkConfig} defaultNetwork="testnet">
                <WalletProvider theme={darkTheme}>
                    <RouterProvider router={router}/>
                </WalletProvider>
            </SuiClientProvider>
        </QueryClientProvider>

    </Theme>
    // </React.StrictMode>
);