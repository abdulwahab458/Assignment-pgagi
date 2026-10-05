import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { ContentCategory, ContentItem } from "@/types/content";

export interface PaginatedResponse {
  items: ContentItem[];
  hasMore: boolean;
  page: number;
}

export interface FeedQueryArgs {
  categories: ContentCategory[];
  page: number;
  pageSize?: number;
  hashtag?: string;
}

export interface SearchQueryArgs {
  q: string;
}

export const contentApi = createApi({
  reducerPath: "contentApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  tagTypes: ["Feed", "Trending", "Search"],
  endpoints: (builder) => ({
    getFeedPage: builder.query<PaginatedResponse, FeedQueryArgs>({
      query: ({ categories, page, pageSize = 6, hashtag = "tech" }) => {
        const params = new URLSearchParams({
          categories: categories.join(","),
          page: String(page),
          pageSize: String(pageSize),
          hashtag,
        });
        return `/feed?${params.toString()}`;
      },
      serializeQueryArgs: ({ queryArgs }) => {
        const { page, ...rest } = queryArgs;
        return rest;
      },
      merge: (currentCache, newItems, { arg }) => {
        if (arg.page === 1) {
          return newItems;
        }
        return {
          ...newItems,
          items: [...(currentCache?.items ?? []), ...newItems.items],
        };
      },
      forceRefetch: ({ currentArg, previousArg }) =>
        currentArg?.page !== previousArg?.page ||
        currentArg?.categories.join(",") !== previousArg?.categories.join(",") ||
        currentArg?.hashtag !== previousArg?.hashtag,
      providesTags: ["Feed"],
    }),
    getTrending: builder.query<ContentItem[], void>({
      query: () => "/trending",
      providesTags: ["Trending"],
    }),
    searchContent: builder.query<ContentItem[], SearchQueryArgs>({
      query: ({ q }) => `/search?q=${encodeURIComponent(q)}`,
      providesTags: ["Search"],
    }),
  }),
});

export const {
  useGetFeedPageQuery,
  useLazyGetFeedPageQuery,
  useGetTrendingQuery,
  useSearchContentQuery,
} = contentApi;
