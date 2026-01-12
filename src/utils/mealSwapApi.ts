import { env } from '@/configs/env';
import type { MealPlanDay } from '@/types/mealPlan';
import type {
  SwapApplyRequest,
  SwapOptionsRequest,
  SwapOptionsResponse,
} from '@/types/mealSwap';

const DEFAULT_API_BASE_URL = 'http://localhost:3000/api';

const getPlannerEndpoint = (mealPlanId: string, suffix: string) =>
  `${env.API_BASE_URL || DEFAULT_API_BASE_URL}/planner/${mealPlanId}${suffix}`;

const parseResponse = async <T>(response: Response): Promise<T> => {
  const data = await response.json();
  if (!data?.success || !data?.data) {
    throw new Error(data?.message || 'Request failed');
  }
  return data.data as T;
};

export const fetchSwapOptions = async (
  mealPlanId: string,
  payload: SwapOptionsRequest,
): Promise<SwapOptionsResponse> => {
  const response = await fetch(
    getPlannerEndpoint(mealPlanId, '/swap-options'),
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(payload),
    },
  );

  if (!response.ok) {
    throw new Error(`Swap options error: ${response.status}`);
  }

  return parseResponse<SwapOptionsResponse>(response);
};

export const applySwap = async (
  mealPlanId: string,
  payload: SwapApplyRequest,
): Promise<MealPlanDay> => {
  const response = await fetch(getPlannerEndpoint(mealPlanId, '/swap'), {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Swap apply error: ${response.status}`);
  }

  return parseResponse<MealPlanDay>(response);
};
