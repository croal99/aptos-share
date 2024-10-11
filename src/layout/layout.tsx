import {Outlet} from "react-router-dom";
import {Box, Flex, Grid} from "@radix-ui/themes";
import {useWallet} from "@aptos-labs/wallet-adapter-react";

import SignIn from "@/components/user/signin.tsx";
import {WalletSelector} from "@aptos-labs/wallet-adapter-ant-design";

import "@/index.css";

export default function Layout() {
    const {account} = useWallet();

    // console.log('account', account);

    if (!account) {
        return <SignIn />
    }

    return (
        <>
            <div className="back-ground h-screen">
                <Flex direction="column" gap="3" p="4">
                    <Box>
                        <Grid columns="2" align="center">
                            <img src="/images/logo.png" alt="" style={{height:'50px'}}/>
                            <Flex justify="end" >
                                <WalletSelector />
                            </Flex>
                        </Grid>
                    </Box>
                    <Box>
                        <Outlet/>
                    </Box>
                </Flex>

            </div>
        </>
    );
}
