import { useEffect, useState } from 'react';
import { tvlFetcher } from 'src/clients/BalancesFetcher';
import useSWR from 'swr';

const useTvl = (): { value: number; loading: boolean } => {
  const [loading, setLoading] = useState(true);
  const [tvl, setTvl] = useState(0);

  const { data, error } = useSWR(process.env.REACT_APP_TVL_URL, tvlFetcher);

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
