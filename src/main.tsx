import ReactDOM from "react-dom/client";
import {Theme} from "@radix-ui/themes";
import {createBrowserRouter, createHashRouter, RouterProvider} from "react-router-dom";

import App from "@/App.tsx";
import View, {loader as viewLoader} from "@/components/view/view.tsx";

import "@radix-ui/themes/styles.css";
import "@aptos-labs/wallet-adapter-ant-design/dist/index.css";
import "@/index.css";


const router = createHashRouter([
// const router = createBrowserRouter([
        {
            id: "root",
            path: "/",
            Component: App,
        },
        {
            path: "/view/:handle/:id",
            Component: View,
            loader: viewLoader,
        },
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
        <RouterProvider router={router}/>

    </Theme>
    // </React.StrictMode>
);