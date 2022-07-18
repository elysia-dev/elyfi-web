import { JsonRpcProvider } from '@ethersproject/providers';

const getProvider = (): JsonRpcProvider => {
  return new JsonRpcProvider(process.env.REACT_APP_JSON_RPC);
};

export default getProvider;
