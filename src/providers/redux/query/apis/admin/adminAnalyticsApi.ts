import { ANALYTICS_DASHBOARD_ENDPOINT } from '@/constants/endpoints';
import { baseApiWithAuth } from '@/redux/query/apis/baseApi';
import type { AdminDashboardStats } from '@/types/analytics';
import type { ApiResponse } from '@/types/apiResponse';

export const adminAnalyticsApi = baseApiWithAuth.injectEndpoints({
  endpoints: (builder) => ({
    getAdminDashboardStats: builder.query<
      ApiResponse<AdminDashboardStats>,
      void
    >({
      query: () => ({
        url: ANALYTICS_DASHBOARD_ENDPOINT,
      }),
    }),
  }),
});

export const { useGetAdminDashboardStatsQuery } = adminAnalyticsApi;
