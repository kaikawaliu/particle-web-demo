import './index.scss';
import { ConnectButton, connectorsForWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import {
    argentWallet,
    coinbaseWallet,
    imTokenWallet,
    injectedWallet,
    ledgerWallet,
    metaMaskWallet,
    omniWallet,
    rainbowWallet,
    trustWallet,
    walletConnectWallet,
} from '@rainbow-me/rainbowkit/wallets';

import { configureChains, createClient, WagmiConfig } from 'wagmi';
import { mainnet, polygon, optimism, arbitrum } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
import '@rainbow-me/rainbowkit/styles.css';
import { particleWallet } from '@particle-network/rainbowkit-ext';
import { useMemo } from 'react';
import { ParticleNetwork } from '@particle-network/auth';

const PageRainbowKit = () => {
    const particle = useMemo(() => {
        return new ParticleNetwork({
            projectId: process.env.REACT_APP_PROJECT_ID as string,
            clientKey: process.env.REACT_APP_CLIENT_KEY as string,
            appId: process.env.REACT_APP_APP_ID as string,
            chainName: 'Ethereum',
            chainId: 1,
            wallet: {
                displayWalletEntry: true,
            },
        });
    }, []);

    const { chains, provider } = configureChains([mainnet, polygon, optimism, arbitrum], [publicProvider()]);

    const popularWallets = useMemo(() => {
        return {
            groupName: 'Popular',
            wallets: [
                particleWallet({ chains, authType: 'google' }),
                particleWallet({ chains, authType: 'facebook' }),
                particleWallet({ chains, authType: 'apple' }),
                particleWallet({ chains }),
                injectedWallet({ chains }),
                rainbowWallet({ chains }),
                coinbaseWallet({ appName: 'RainbowKit demo', chains }),
                metaMaskWallet({ chains }),
                walletConnectWallet({ chains }),
            ],
        };
    }, [particle]);

    const connectors = connectorsForWallets([
        popularWallets,
        {
            groupName: 'Other',
            wallets: [
                argentWallet({ chains }),
                trustWallet({ chains }),
                omniWallet({ chains }),
                imTokenWallet({ chains }),
                ledgerWallet({ chains }),
            ],
        },
    ]);

    const wagmiClient = createClient({
        autoConnect: true,
        connectors,
        provider,
    });

    return (
        <WagmiConfig client={wagmiClient}>
            <RainbowKitProvider chains={chains}>
                <div className="rainbowkit-box">
                    <div className="rainbowkit-connect-btn">
                        <ConnectButton />
                    </div>

                    <a
                        href="https://docs.particle.network/auth-service/sdks/web#evm-rainbowkit-integration"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rainbowkit-developer-docs"
                    >
                        Developer Documentation
                    </a>
                </div>
            </RainbowKitProvider>
        </WagmiConfig>
    );
};
export default PageRainbowKit;
