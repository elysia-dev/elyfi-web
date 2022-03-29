import { ethers } from 'ethers';

const getProvider = (): ethers.providers.JsonRpcProvider => {
  return new ethers.providers.JsonRpcProvider(process.env.REACT_APP_JSON_RPC);
};

export default getProvider;
