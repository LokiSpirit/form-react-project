import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Result } from '../../components/result-component/ResultsComponent';

export interface FetchItemsResponse {
  data: { count: number; results: Result[] };
  isLoading: boolean;
  isError: boolean;
}

type FetchItemsQueryArgs = {
  pageName: string;
  searchTerm?: string;
  page: number;
};

type fetchItemDetailsResponse = {
  data: { results: Result };
  isLoading: boolean;
  isError: boolean;
};

type fetchItemDetailsQueryArgs = { pageName: string; selectedId: string };

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://swapi.dev/api/' }),
  endpoints: (builder) => ({
    fetchItems: builder.query<FetchItemsResponse, FetchItemsQueryArgs>({
      query: ({ pageName, searchTerm, page }) => {
        return `${pageName}/?page=${page}&search=${searchTerm ? searchTerm : ''}`;
      },
    }),
    fetchItemDetails: builder.query<fetchItemDetailsResponse, fetchItemDetailsQueryArgs>({
      query: ({ pageName, selectedId }) => {
        if (!pageName || !selectedId) throw new Error('No endpoint');
        return `${pageName}/${selectedId}/`;
      },
    }),
  }),
});

export const { useFetchItemsQuery, useFetchItemDetailsQuery } = apiSlice;
