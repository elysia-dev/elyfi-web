import { useEffect, useState } from 'react';
import useSWR from 'swr';
import { tvlBalanceFetcher } from 'src/clients/BalancesFetcher';

const useTvl = (): { value: number; loading: boolean } => {
  const [loading, setLoading] = useState(true);
  const [tvl, setTvl] = useState(0);

  const { data, error } = useSWR(
    process.env.REACT_APP_TVL_URL,
    tvlBalanceFetcher,
  );

  useEffect(() => {
    if (!data && !error) return;
    setLoading(false);
    setTvl(data?.tvlExceptElTvl || 0);
  }, [data, error]);

  return {
    value: tvl,
    loading,
  };
};

export default useTvl;
