import ReactDOM from "react-dom/client";
import {Theme} from "@radix-ui/themes";
import {createHashRouter, RouterProvider} from "react-router-dom";
import {PetraWallet} from "petra-plugin-wallet-adapter";
import {AptosWalletAdapterProvider} from "@aptos-labs/wallet-adapter-react";

import App from "@/App.tsx";
import Layout from "@/layout/layout.tsx";
import View, {loader as viewLoader} from "@/components/view/view.tsx";

import "@radix-ui/themes/styles.css";
import "@aptos-labs/wallet-adapter-ant-design/dist/index.css";
import "@/index.css";

const router = createHashRouter([
        {
            id: "root",
            path: "/",
            Component: Layout,

            children: [
                {
                    index: true,
                    Component: App,
                },
            ],
        },
        {
            path: "/view/:handle/:id",
            Component: View,
            loader: viewLoader,
        },
    ]
);

const wallets = [new PetraWallet()];

ReactDOM.createRoot(document.getElementById("root")!).render(
    // <React.StrictMode>
    <Theme
        appearance="light"
        accentColor="amber"
        panelBackground="solid"
        scaling="100%"
        radius="full"
    >
        <AptosWalletAdapterProvider plugins={wallets} autoConnect={true}>
            <RouterProvider router={router}/>
        </AptosWalletAdapterProvider>

    </Theme>
    // </React.StrictMode>
);