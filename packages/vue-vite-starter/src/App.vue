<script setup lang="ts">
import { ref } from 'vue'
import { ParticleConnect, Chain, ConnectConfig, Provider, metaMask, web3Modal } from '@particle-network/connect'
import { Ethereum, EthereumGoerli } from '@particle-network/common';

const provider = ref<Provider | undefined>(void 0)
const phone = ref<string>('');
const email = ref<string>('');

const config: ConnectConfig = {
  projectId: import.meta.env.VITE_APP_PROJECT_ID,
  clientKey: import.meta.env.VITE_APP_CLIENT_KEY,
  appId: import.meta.env.VITE_APP_APP_ID,
  chains: [Ethereum as Chain, EthereumGoerli as Chain],
  wallets: [metaMask(), web3Modal()],
}

const connectKit = new ParticleConnect(config);

const connectWallet = async (id: string, options?: any) => {
  console.log('connectWallet', id, options);
  try {
    const connectProvider = await connectKit.connect(id, options);
    provider.value = connectProvider;
  } catch (error) {
    console.error('connectWallet', error);
  }
};
</script>

<template>
  <div class="main-box">
    <div class="custom-button" @click="connectWallet('metamask')">
      MetaMask
    </div>

    <div class="custom-button" @click="connectWallet('web3Modal')">
      WalletConnect
    </div>

    <div class="custom-button" @click="connectWallet('particle')">
      Particle
    </div>

    <div class="custom-button" @click="connectWallet('particle', { preferredAuthType: 'google' })">
      Connect With Google
    </div>


    <input class="input" type="number" v-model="phone" placeholder="phone" />
    <div class="custom-button" @click="connectWallet('particle', { preferredAuthType: 'phone', account: phone })">
      Connect With Phone
    </div>
    <input class="input" type="email" v-model="email" placeholder="email">

    <div class="custom-button" @click="connectWallet('particle', { preferredAuthType: 'email', account: email })">
      Connect With Email
    </div>
  </div>
</template>

<style lang="scss" scoped>
.main-box {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  box-sizing: border-box;
}

.custom-button {
  margin: 20px;
  background-color: #5177f9;
  font-size: 14px;
  color: white;
  height: 50px;
  line-height: 50px;
  padding: 0 20px;
  border-radius: 25px;
  border: none;
  cursor: pointer;
  transition: all 0.4s;
  max-width: 100%;

}

.custom-button:hover {
  opacity: 0.8;
}

.input {
  width: 200px;
  height: 40px;
  line-height: 40px;
  font-size: 14px;
  border: 1px solid #eee;
  padding: 0 10px;
}
</style>