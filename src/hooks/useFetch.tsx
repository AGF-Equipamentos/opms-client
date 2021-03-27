import useSWR from 'swr';
import api from '../services/api';

interface Response {
  data: any;
  error: any;
  mutate: any;
}

export function useFetch<Data = any, Error = any>(
  url: string,
  params: object = {},
  refresh = 120000,
): Response {
  const { data, error, mutate } = useSWR<Data, Error>(
    url,
    async urlparam => {
      const response = await api.get(urlparam, params);
      localStorage.setItem(`@OPms:${urlparam}`, JSON.stringify(response.data));
      return response.data;
    },
    {
      refreshInterval: refresh,
    },
  );

  return { data, error, mutate };
}
