import { createThirdwebClient } from "thirdweb";
import { ConnectButton } from "thirdweb/react";
import { lightTheme } from "thirdweb/react";
import { createWallet } from "thirdweb/wallets";
import { client } from "../client"



const wallets = [
  createWallet("io.metamask"),
  createWallet("com.coinbase.wallet"),
  createWallet("me.rainbow"),
  createWallet("io.rabby"),
  createWallet("io.zerion.wallet"),
];

export default function ConnectWallet() {
  return (
    <ConnectButton
      client={client}
      wallets={wallets}
      theme={lightTheme({
        colors: { modalBg: "#f2eded",
            primaryButtonBg: "#ccf2f2",
            primaryButtonText: "black"
         },
      })}
      connectModal={{ size: "compact" }}
    />
  );
}