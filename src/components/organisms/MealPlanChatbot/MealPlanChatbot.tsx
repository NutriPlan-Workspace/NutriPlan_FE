import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { FaPaperPlane, FaTimes } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { AnimatePresence, motion } from 'motion/react';

import { env } from '@/configs/env';
import { useDate } from '@/contexts/DateContext';
import { useUpdateMealPlanMutation } from '@/redux/query/apis/mealPlan/mealPlanApi';
import {
  closeSwapModal,
  mealPlanSelector,
  openSwapModal,
  setFlashMealCardIds,
  setSwapModalData,
  setSwapModalFilters,
  setSwapModalLoading,
  type SwapModalFilters,
  updateCacheMealPlanByDate,
  updateViewingMealPlanByDates,
} from '@/redux/slices/mealPlan';
import type { DetailedFoodResponse, Food } from '@/types/food';
import type { MealPlanDay, MealPlanFood } from '@/types/mealPlan';
import type { SwapOptionsResponse as PlannerSwapOptionsResponse } from '@/types/mealSwap';
import { getMealDate } from '@/utils/dateUtils';
import {
  getMealPlanDayAfterAddAndRemoveMealItem,
  getMealPlanDayDatabaseDTOByMealPlanDay,
} from '@/utils/mealPlan';
import { showToastError } from '@/utils/toastUtils';

type MealType = 'breakfast' | 'lunch' | 'dinner';

type Language = 'vi' | 'en';

type ChatMessage = { role: 'user' | 'assistant'; content: string };

type UndoEntry = {
  mealDate: string;
  previousMealPlanDay: MealPlanDay;
  description: string;
  timestamp: number;
};

type MealAction =
  | {
      type: 'reorder';
      mealDate?: string;
      mealType: MealType;
      fromIndex: number;
      toIndex: number;
    }
  | {
      type: 'swap';
      mealDate?: string;
      mealType: MealType;
      indexA: number;
      indexB: number;
    }
  | {
      type: 'move';
      mealDate?: string;
      fromMealType: MealType;
      fromIndex: number;
      toMealType: MealType;
      toIndex: number;
    }
  | {
      type: 'replace_food';
      mealDate?: string;
      mealType: MealType;
      targetIndex: number;
      limit?: number;
      tolerance?: number;
      autoPick?: boolean;
      replacementQuery?: string;
      filters?: SwapModalFilters;
    }
  | {
      type: 'apply_swap_option';
      optionIndex: number;
    }
  | {
      type: 'food_info';
      mealDate?: string;
      mealType: MealType;
      targetIndex: number;
    }
  | { type: 'message'; text: string };

type AiChatMessage = { role: 'system' | 'user' | 'assistant'; content: string };

type FoodSwapOption = {
  foodId: string;
  amount?: number;
  unit?: number;
  nutrition?: {
    calories?: number;
    protein?: number;
    carbs?: number;
    fat?: number;
  };
  food?: {
    name?: string;
  };
};

type ChatbotSwapOptionsResponse = {
  mealPlanId: string;
  mealType: MealType;
  swapType: 'food';
  target: {
    foodId?: string;
    amount?: number;
    unit?: number;
    food?: {
      name?: string;
    };
  };
  options: FoodSwapOption[];
};

type PendingSwap = {
  mealDate: string;
  mealPlanId: string;
  mealType: MealType;
  targetItemId?: string;
  options: FoodSwapOption[];
};

const HELLO_MESSAGE: Record<Language, string> = {
  vi: 'Chào bạn! Mình có thể giúp bạn đổi vị trí món trong ngày đang xem, gợi ý thay thế món, và trả lời câu hỏi dinh dưỡng như “Món này có hợp ăn sáng không?” hoặc “Món này tốt cho mình không?”.',
  en: 'Hi! I can help you reorder meals for the active day, suggest swaps, and answer nutrition questions like “Is this dish good for breakfast?” or “Is this food healthy for me?”.',
};

const getInitialLanguage = (): Language => {
  try {
    const navLang = typeof navigator !== 'undefined' ? navigator.language : '';
    return navLang?.toLowerCase().startsWith('vi') ? 'vi' : 'en';
  } catch {
    return 'en';
  }
};

const detectLanguage = (text: string): Language => {
  const input = text.trim();
  if (!input) return 'en';

  const hasVietnameseDiacritics =
    /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i.test(
      input,
    );
  if (hasVietnameseDiacritics) return 'vi';

  const vietnameseKeywords =
    /\b(mình|bạn|giúp|làm sao|thực đơn|bữa|ăn sáng|ăn trưa|ăn tối|đổi|hoàn tác|quay lại|không hiểu|hướng dẫn)\b/i;
  if (vietnameseKeywords.test(input)) return 'vi';

  return 'en';
};

const createInitialMessages = (language: Language): ChatMessage[] => [
  { role: 'assistant', content: HELLO_MESSAGE[language] },
];

const MEAL_TYPE_LABELS: Record<MealType, string> = {
  breakfast: 'bữa sáng',
  lunch: 'bữa trưa',
  dinner: 'bữa tối',
};

const buildSystemPrompt = (
  language: Language,
) => `You are the NutriPlan assistant.
Return ONLY valid JSON (no markdown).
Always respond in the same language as the user's latest message. The user's language is: ${
  language === 'vi' ? 'Vietnamese' : 'English'
}.
Supported types:
- {"type":"reorder","mealDate":"YYYY-MM-DD","mealType":"breakfast|lunch|dinner","fromIndex":1,"toIndex":3}
- {"type":"swap","mealDate":"YYYY-MM-DD","mealType":"breakfast|lunch|dinner","indexA":1,"indexB":3}
- {"type":"move","mealDate":"YYYY-MM-DD","fromMealType":"breakfast|lunch|dinner","fromIndex":1,"toMealType":"breakfast|lunch|dinner","toIndex":2}
- {"type":"replace_food","mealDate":"YYYY-MM-DD","mealType":"breakfast|lunch|dinner","targetIndex":1,"limit":5,"tolerance":0.2,"replacementQuery":"optional", "filters":{"q":"...","dishType":"main|side","categoryIds":[1,2]}}
- {"type":"apply_swap_option","optionIndex":1}
- {"type":"food_info","mealDate":"YYYY-MM-DD","mealType":"breakfast|lunch|dinner","targetIndex":1}
- {"type":"message","text":"..."}
- If the user asks how to use the NutriPlan app, reply with type "message" and clear step-by-step guidance.
- If the user asks general nutrition/health questions or wants feedback on a meal, reply with type "message" and a helpful explanation/suggestions without changing the meal plan.
Use 1-based indices. If anything is missing or ambiguous, return type "message" and ask a short follow-up.`;

const DEFAULT_API_BASE_URL = 'http://localhost:3000/api';
const AI_CHAT_PATH = '/ai/chat';
const PLANNER_PATH = '/planner';
const FOODS_PATH = '/foods';
const getAiEndpoint = () =>
  `${env.API_BASE_URL || DEFAULT_API_BASE_URL}${AI_CHAT_PATH}`;
const getPlannerEndpoint = (mealPlanId: string, suffix: string) =>
  `${env.API_BASE_URL || DEFAULT_API_BASE_URL}${PLANNER_PATH}/${mealPlanId}${suffix}`;
const getFoodEndpoint = (foodId: string) =>
  `${env.API_BASE_URL || DEFAULT_API_BASE_URL}${FOODS_PATH}/${foodId}`;

const buildMealContext = (
  mealPlanDay: MealPlanDay | undefined,
  mealDate: string,
) => {
  const mealItems = mealPlanDay?.mealItems ?? {
    breakfast: [],
    lunch: [],
    dinner: [],
  };

  return {
    mealDate: mealPlanDay?.mealDate ?? mealDate,
    meals: {
      breakfast: mealItems.breakfast.map((meal, index) => ({
        index: index + 1,
        name: meal.foodId.name,
      })),
      lunch: mealItems.lunch.map((meal, index) => ({
        index: index + 1,
        name: meal.foodId.name,
      })),
      dinner: mealItems.dinner.map((meal, index) => ({
        index: index + 1,
        name: meal.foodId.name,
      })),
    },
  };
};

const isMealType = (value: unknown): value is MealType =>
  value === 'breakfast' || value === 'lunch' || value === 'dinner';

const toNumber = (value: unknown) =>
  typeof value === 'number' ? value : Number(value);

const parseMealAction = (rawText: string): MealAction => {
  if (!rawText) {
    return {
      type: 'message',
      text: 'Mình chưa nhận được phản hồi từ trợ lý. Bạn thử lại nhé.',
    };
  }

  const jsonMatch = rawText.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    return {
      type: 'message',
      text: 'Mình chưa hiểu yêu cầu. Bạn có thể nói rõ món và vị trí không?',
    };
  }

  try {
    const parsed = JSON.parse(jsonMatch[0]);
    if (!parsed || typeof parsed !== 'object') {
      throw new Error('Invalid JSON shape');
    }

    if (parsed.type === 'message' && typeof parsed.text === 'string') {
      return { type: 'message', text: parsed.text };
    }

    if (parsed.type === 'reorder' && isMealType(parsed.mealType)) {
      const fromIndex = toNumber(parsed.fromIndex);
      const toIndex = toNumber(parsed.toIndex);
      return {
        type: 'reorder',
        mealDate: parsed.mealDate,
        mealType: parsed.mealType,
        fromIndex,
        toIndex,
      };
    }

    if (parsed.type === 'swap' && isMealType(parsed.mealType)) {
      const indexA = toNumber(parsed.indexA);
      const indexB = toNumber(parsed.indexB);
      return {
        type: 'swap',
        mealDate: parsed.mealDate,
        mealType: parsed.mealType,
        indexA,
        indexB,
      };
    }

    if (
      parsed.type === 'move' &&
      isMealType(parsed.fromMealType) &&
      isMealType(parsed.toMealType)
    ) {
      const fromIndex = toNumber(parsed.fromIndex);
      const toIndex = toNumber(parsed.toIndex);
      return {
        type: 'move',
        mealDate: parsed.mealDate,
        fromMealType: parsed.fromMealType,
        fromIndex,
        toMealType: parsed.toMealType,
        toIndex,
      };
    }

    if (parsed.type === 'replace_food' && isMealType(parsed.mealType)) {
      const targetIndex = toNumber(parsed.targetIndex);
      const limit =
        parsed.limit !== undefined ? toNumber(parsed.limit) : undefined;
      const tolerance =
        parsed.tolerance !== undefined ? Number(parsed.tolerance) : undefined;
      return {
        type: 'replace_food',
        mealDate: parsed.mealDate,
        mealType: parsed.mealType,
        targetIndex,
        limit,
        tolerance,
        autoPick:
          parsed.autoPick === undefined ? undefined : Boolean(parsed.autoPick),
        replacementQuery:
          typeof parsed.replacementQuery === 'string'
            ? parsed.replacementQuery
            : undefined,
        filters:
          parsed.filters && typeof parsed.filters === 'object'
            ? (parsed.filters as SwapModalFilters)
            : undefined,
      };
    }

    if (parsed.type === 'apply_swap_option') {
      const optionIndex = toNumber(parsed.optionIndex);
      return {
        type: 'apply_swap_option',
        optionIndex,
      };
    }

    if (parsed.type === 'food_info' && isMealType(parsed.mealType)) {
      const targetIndex = toNumber(parsed.targetIndex);
      return {
        type: 'food_info',
        mealDate: parsed.mealDate,
        mealType: parsed.mealType,
        targetIndex,
      };
    }
  } catch {
    return {
      type: 'message',
      text: 'Mình gặp lỗi khi đọc phản hồi. Bạn thử lại với câu ngắn hơn nhé.',
    };
  }

  return {
    type: 'message',
    text: 'Mình chưa rõ yêu cầu. Bạn mô tả lại giúp mình nhé.',
  };
};

const inferSwapFiltersFromText = (text: string): SwapModalFilters => {
  const input = text.trim();
  if (!input) return {};

  if (
    /\b(không\s*filter|khong\s*filter|không\s*cần\s*filter|khong\s*can\s*filter)\b/i.test(
      input,
    )
  ) {
    return {};
  }

  const filters: SwapModalFilters = {};

  const match = input.match(/\b(sang|thành|thanh)\b\s+(.+)$/i);
  if (match?.[2]) {
    const raw = match[2]
      .replace(/^["'“”‘’]+|["'“”‘’]+$/g, '')
      .replace(/\b(món|mon|thức\s*ăn|thuc\s*an)\b\s*/i, '')
      .trim();
    if (raw) filters.q = raw;
  }

  if (/\b(món\s*chính|mon\s*chinh)\b/i.test(input)) {
    filters.dishType = 'main';
  } else if (/\b(món\s*phụ|mon\s*phu)\b/i.test(input)) {
    filters.dishType = 'side';
  }

  return filters;
};

const readEventStream = async (response: Response) => {
  if (!response.body) return '';

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  let fullText = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });

    while (true) {
      const lineEnd = buffer.indexOf('\n');
      if (lineEnd === -1) break;

      const line = buffer.slice(0, lineEnd).trim();
      buffer = buffer.slice(lineEnd + 1);

      if (!line.startsWith('data:')) continue;
      const payload = line.slice(5).trim();

      if (payload === '[DONE]') {
        return fullText;
      }

      try {
        const json = JSON.parse(payload);
        const delta =
          json?.choices?.[0]?.delta?.content ??
          json?.choices?.[0]?.message?.content ??
          '';
        if (typeof delta === 'string') {
          fullText += delta;
        }
      } catch {
        // Ignore invalid chunks.
      }
    }
  }

  return fullText;
};

const MAX_HISTORY = 6;

const buildChatHistory = (
  messages: ChatMessage[],
  maxHistory: number,
): AiChatMessage[] =>
  messages.slice(-maxHistory).map((message) => ({
    role: message.role,
    content: message.content,
  }));

const formatPendingSwapOptions = (pendingSwap: PendingSwap | null) => {
  if (!pendingSwap || pendingSwap.options.length === 0) return '';
  const options = pendingSwap.options
    .map((option, index) => ({
      index: index + 1,
      name: option.food?.name || option.foodId,
    }))
    .slice(0, 6);

  return `Pending swap options: ${JSON.stringify(options)}`;
};

const buildRecentChangesContext = (undoStack: UndoEntry[]) => {
  if (!undoStack.length) return '';
  const compact = undoStack.slice(-3).map((entry, index) => ({
    index: undoStack.length - (undoStack.slice(-3).length - 1 - index),
    description: entry.description,
    mealDate: entry.mealDate,
  }));
  return `Recent changes (for undo/revert): ${JSON.stringify(compact)}`;
};

const isRevertCommand = (input: string) =>
  /^(revert|undo|rollback|hoan tac|hoàn tác|quay lại|huy thay doi|hủy thay đổi)(\s+\d+)?$/i.test(
    input.trim(),
  );

const parseRevertSteps = (input: string) => {
  const match = input.trim().match(/(\d+)$/);
  if (!match) return 1;
  const steps = Number(match[1]);
  return Number.isFinite(steps) && steps > 0 ? Math.min(steps, 3) : 1;
};

const collectIdsInRange = (
  items: MealPlanFood[],
  startIndex: number,
  endIndex: number,
) => {
  const start = Math.max(0, Math.min(startIndex, endIndex));
  const end = Math.min(items.length - 1, Math.max(startIndex, endIndex));
  return items
    .slice(start, end + 1)
    .map((item) => item?._id)
    .filter(Boolean) as string[];
};

const parseOptionSelection = (input: string) => {
  const match = input.trim().match(/^(?:option|choose|chon)?\s*(\d+)$/i);
  return match ? Number(match[1]) : null;
};

const moveItem = (
  items: MealPlanFood[],
  fromIndex: number,
  toIndex: number,
) => {
  const updated = [...items];
  const [moved] = updated.splice(fromIndex, 1);
  updated.splice(toIndex, 0, moved);
  return updated;
};

const swapItems = (items: MealPlanFood[], indexA: number, indexB: number) => {
  const updated = [...items];
  [updated[indexA], updated[indexB]] = [updated[indexB], updated[indexA]];
  return updated;
};

const HELP_HINTS: Record<Language, string[]> = {
  vi: [
    'Bạn cần mình giúp đổi món hoặc dinh dưỡng? Nhấn NutriBot nhé.',
    'Bạn có thể gõ: “Đổi món 1 và 3 bữa sáng hôm nay”.',
    'Thử hỏi: “Bữa này đã ổn chưa? Nên thay gì?”.',
  ],
  en: [
    'Need help with swaps or nutrition? Tap NutriBot.',
    'Try: “Swap item 1 and 3 in today breakfast”.',
    'Ask: “Is this meal balanced? What should I change?”.',
  ],
};

const ChatbotAnimationDuration = 520;
const AVATAR_WIDTH_DEFAULT = 125;
const AVATAR_HEIGHT_DEFAULT = 60;
const AVATAR_WIDTH_OPEN = 250;
const AVATAR_HEIGHT_OPEN = 120;
const BotHelloDurationMs = 2400;
const BotResultDurationMs = 2400;

type AssistantAnimationState = 'hello' | 'sad' | 'idle' | 'done' | 'neutral';

const MealPlanChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [preferredLanguage, setPreferredLanguage] = useState<Language>(() =>
    getInitialLanguage(),
  );
  const [messages, setMessages] = useState<ChatMessage[]>(() =>
    createInitialMessages(getInitialLanguage()),
  );
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const panelVisible = isOpen || isClosing;
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [pendingSwap, setPendingSwap] = useState<PendingSwap | null>(null);
  const [avatarLoaded, setAvatarLoaded] = useState(false);
  const flashTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [undoStack, setUndoStack] = useState<UndoEntry[]>([]);
  const [closeCount, setCloseCount] = useState(0);
  const botAnimationTimerRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const [assistantAnimation, setAssistantAnimation] =
    useState<AssistantAnimationState>('idle');

  const { selectedDate } = useDate();
  const { viewingMealPlans } = useSelector(mealPlanSelector);
  const dispatch = useDispatch();
  const [updateMealPlan] = useUpdateMealPlanMutation();

  const defaultMealDate = useMemo(
    () => getMealDate(selectedDate),
    [selectedDate],
  );

  const findMealPlanDay = useCallback(
    (mealDate: string) =>
      viewingMealPlans.find(
        (mealPlan) =>
          new Date(mealPlan.mealDate).toDateString() ===
          new Date(mealDate).toDateString(),
      )?.mealPlanDay,
    [viewingMealPlans],
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading, isOpen]);

  useEffect(() => {
    if (botAnimationTimerRef.current) {
      clearTimeout(botAnimationTimerRef.current);
      botAnimationTimerRef.current = null;
    }

    if (isLoading) {
      setAssistantAnimation('neutral');
      return;
    }

    const last = messages[messages.length - 1];
    if (last?.role === 'assistant') {
      const isSadReply =
        typeof last.content === 'string' &&
        /(lỗi|thất bại|không thể|error|failed|sorry)/i.test(last.content);

      const isHappyReply =
        typeof last.content === 'string' &&
        /(tuyệt|tốt|ổn|great|nice|good job|excellent)/i.test(last.content);

      setAssistantAnimation(
        isSadReply ? 'sad' : isHappyReply ? 'done' : 'neutral',
      );
      botAnimationTimerRef.current = setTimeout(() => {
        setAssistantAnimation('idle');
        botAnimationTimerRef.current = null;
      }, BotResultDurationMs);
      return;
    }

    setAssistantAnimation('idle');
  }, [isLoading, messages]);

  useEffect(
    () => () => {
      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current);
        closeTimerRef.current = null;
      }
      if (botAnimationTimerRef.current) {
        clearTimeout(botAnimationTimerRef.current);
        botAnimationTimerRef.current = null;
      }
    },
    [],
  );

  const handleToggleChat = useCallback(() => {
    if (isOpen) {
      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current);
      }

      if (botAnimationTimerRef.current) {
        clearTimeout(botAnimationTimerRef.current);
        botAnimationTimerRef.current = null;
      }

      setAssistantAnimation('hello');
      botAnimationTimerRef.current = setTimeout(() => {
        setAssistantAnimation('idle');
        botAnimationTimerRef.current = null;
      }, BotHelloDurationMs);

      setIsClosing(true);
      setIsOpen(false);
      setCloseCount((prev) => prev + 1);
      closeTimerRef.current = setTimeout(() => {
        setIsClosing(false);
        closeTimerRef.current = null;
      }, ChatbotAnimationDuration);
      return;
    }

    if (botAnimationTimerRef.current) {
      clearTimeout(botAnimationTimerRef.current);
      botAnimationTimerRef.current = null;
    }

    setIsClosing(false);
    setIsOpen(true);

    setAssistantAnimation('hello');
    botAnimationTimerRef.current = setTimeout(() => {
      setAssistantAnimation('idle');
      botAnimationTimerRef.current = null;
    }, BotHelloDurationMs);
  }, [isOpen]);

  const pushUndoEntry = useCallback((entry: UndoEntry) => {
    setUndoStack((prev) => {
      const next = [...prev, entry];
      return next.slice(-6);
    });
  }, []);

  const requestMarketplaceAction = useCallback(
    async (
      userMessage: string,
      history: AiChatMessage[],
      pendingSwapState: PendingSwap | null,
    ): Promise<MealAction> => {
      const mealPlanDay = findMealPlanDay(defaultMealDate);
      const context = buildMealContext(mealPlanDay, defaultMealDate);
      const pendingInfo = formatPendingSwapOptions(pendingSwapState);
      const recentChanges = buildRecentChangesContext(undoStack);
      const systemPrompt = buildSystemPrompt(preferredLanguage);
      const prompt = `Default date: ${defaultMealDate}
Current meals (1-based index):
${JSON.stringify(context, null, 2)}
${pendingInfo ? `${pendingInfo}\n` : ''}${recentChanges ? `${recentChanges}\n` : ''}
Request: ${userMessage}`;
      const messagesPayload: AiChatMessage[] = [
        { role: 'system', content: systemPrompt },
        ...history,
        { role: 'user', content: prompt },
      ];

      const response = await fetch(getAiEndpoint(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          messages: messagesPayload,
          temperature: 0.2,
          top_p: 1,
          stream: true,
        }),
      });

      if (!response.ok) {
        throw new Error(`AI API error: ${response.status}`);
      }

      const contentType = response.headers.get('content-type') ?? '';
      let content = '';
      if (contentType.includes('text/event-stream')) {
        content = await readEventStream(response);
      } else {
        const data = await response.json();
        content = data?.content ?? data?.data?.content ?? '';
      }

      return parseMealAction(content);
    },
    [defaultMealDate, findMealPlanDay],
  );

  const triggerFlash = useCallback(
    (cardIds: string[]) => {
      if (flashTimerRef.current) {
        clearTimeout(flashTimerRef.current);
      }
      dispatch(setFlashMealCardIds({ mealCardIds: cardIds }));
      flashTimerRef.current = setTimeout(() => {
        dispatch(setFlashMealCardIds({ mealCardIds: [] }));
      }, 900);
    },
    [dispatch],
  );

  const applyMealPlanFromServer = useCallback(
    (mealPlanDay: MealPlanDay) => {
      const mealDate = mealPlanDay.mealDate;
      dispatch(
        updateViewingMealPlanByDates({
          mealPlanWithDates: [{ mealDate, mealPlanDay }],
        }),
      );
      dispatch(
        updateCacheMealPlanByDate({
          mealPlanWithDate: { mealDate, mealPlanDay },
        }),
      );
    },
    [dispatch],
  );

  const fetchSwapOptions = useCallback(
    async (
      mealPlanDay: MealPlanDay,
      mealType: MealType,
      targetIndex: number,
      limit?: number,
      tolerance?: number,
    ) => {
      const targetItem = mealPlanDay.mealItems[mealType][targetIndex];
      if (!targetItem) {
        throw new Error('Target item not found');
      }

      const payload: Record<string, unknown> = {
        swapType: 'food',
        mealType,
        targetFoodId: targetItem.foodId?._id,
        targetItemId: targetItem._id,
      };
      if (typeof limit === 'number' && !Number.isNaN(limit)) {
        payload.limit = limit;
      }
      if (typeof tolerance === 'number' && !Number.isNaN(tolerance)) {
        payload.tolerance = tolerance;
      }

      const response = await fetch(
        getPlannerEndpoint(mealPlanDay._id, '/swap-options'),
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

      const data = await response.json();
      if (!data?.success || !data?.data) {
        throw new Error(data?.message || 'Swap options failed');
      }

      return {
        swapOptions: data.data as ChatbotSwapOptionsResponse,
        targetItemId: targetItem._id,
      };
    },
    [],
  );

  const applySwapOption = useCallback(
    async (swapState: PendingSwap, optionIndex: number) => {
      if (optionIndex < 1 || optionIndex > swapState.options.length) {
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content:
              preferredLanguage === 'vi'
                ? 'Số lựa chọn không hợp lệ.'
                : 'Option index is not valid.',
          },
        ]);
        return;
      }

      const option = swapState.options[optionIndex - 1];
      if (!swapState.targetItemId) {
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content:
              preferredLanguage === 'vi'
                ? 'Thiếu món mục tiêu để thay.'
                : 'Missing target item for swap.',
          },
        ]);
        return;
      }
      const replacement: Record<string, unknown> = { foodId: option.foodId };
      if (option.amount !== undefined) replacement.amount = option.amount;
      if (option.unit !== undefined) replacement.unit = option.unit;

      try {
        const previousState = findMealPlanDay(swapState.mealDate);
        const response = await fetch(
          getPlannerEndpoint(swapState.mealPlanId, '/swap'),
          {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
              swapType: 'food',
              mealType: swapState.mealType,
              targetItemId: swapState.targetItemId,
              replacement,
            }),
          },
        );

        if (!response.ok) {
          throw new Error(`Swap apply error: ${response.status}`);
        }

        const data = await response.json();
        if (!data?.success || !data?.data) {
          throw new Error(data?.message || 'Swap apply failed');
        }

        applyMealPlanFromServer(data.data);
        if (swapState.targetItemId) {
          triggerFlash([swapState.targetItemId]);
        }

        if (previousState?._id) {
          pushUndoEntry({
            mealDate: swapState.mealDate,
            previousMealPlanDay: previousState,
            description:
              preferredLanguage === 'vi'
                ? `Thay món (${swapState.mealType}) ngày ${swapState.mealDate}`
                : `Replace food (${swapState.mealType}) on ${swapState.mealDate}`,
            timestamp: Date.now(),
          });
        }

        setPendingSwap(null);
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content:
              preferredLanguage === 'vi'
                ? `Đã thay bằng ${option.food?.name || option.foodId}.`
                : `Replaced with ${option.food?.name || option.foodId}.`,
          },
        ]);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Unknown error';
        showToastError(`Swap failed: ${errorMessage}`);
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content:
              preferredLanguage === 'vi'
                ? 'Thay món thất bại. Bạn thử lại giúp mình nhé.'
                : 'Swap failed. Please try again.',
          },
        ]);
      }
    },
    [
      applyMealPlanFromServer,
      findMealPlanDay,
      preferredLanguage,
      pushUndoEntry,
      triggerFlash,
    ],
  );

  const buildFoodInfoMessage = useCallback(
    (
      mealItem: MealPlanFood,
      detailedFood: DetailedFoodResponse['data'] | null,
      external: {
        source: 'openfoodfacts';
        productName?: string;
        ingredientsText?: string;
        allergens?: string;
        nutriScoreGrade?: string;
      } | null,
    ) => {
      const food = mealItem.foodId;
      const nutrition = food?.nutrition;
      const nutritionExtras = nutrition as unknown as
        | {
            proteins?: number;
            fiber?: number;
            sugar?: number;
            sodium?: number;
            saturatedFats?: number;
            carbs?: number;
            fats?: number;
            fat?: number;
          }
        | undefined;
      const unit = food?.units?.[mealItem.unit];
      const unitLabel = unit?.description
        ? `${mealItem.amount} ${unit.description}`
        : `${mealItem.amount}`;

      const ingredientLines = (() => {
        const mainFood = detailedFood?.mainFood;
        const ingredientList = detailedFood?.ingredientList ?? [];
        const ingredients = mainFood?.ingredients ?? [];
        if (!ingredients.length) return [] as string[];

        const idToFood = new Map<string, Food>();
        ingredientList.forEach((f) => idToFood.set(f._id, f));

        return ingredients.slice(0, 10).map((ing) => {
          const ingredient = ing as unknown as {
            ingredientFoodId?: string | { _id?: string; name?: string };
            unit?: number;
            amount?: number;
            preparation?: string;
          };

          const ingredientFoodIdRaw = ingredient.ingredientFoodId;
          const ingredientFoodId =
            typeof ingredientFoodIdRaw === 'string'
              ? ingredientFoodIdRaw
              : ingredientFoodIdRaw?._id;
          const ref = ingredientFoodId
            ? idToFood.get(String(ingredientFoodId))
            : undefined;
          const name =
            ref?.name ||
            (typeof ingredientFoodIdRaw === 'object'
              ? ingredientFoodIdRaw?.name
              : undefined) ||
            'Unknown';
          const ingUnit =
            typeof ingredient.unit === 'number' && ref?.units?.[ingredient.unit]
              ? ref.units[ingredient.unit].description
              : `unit #${ingredient.unit ?? 0}`;
          const prep = ingredient.preparation
            ? ` (${ingredient.preparation})`
            : '';
          return `- ${name}: ${ingredient.amount ?? 0} ${ingUnit}${prep}`;
        });
      })();

      const directionLines = (() => {
        const directions = detailedFood?.mainFood?.directions ?? [];
        if (!directions.length) return [] as string[];
        return directions.slice(0, 5).map((step, idx) => `${idx + 1}. ${step}`);
      })();

      const healthNotes: string[] = [];
      const calories = nutrition?.calories ?? 0;
      const protein = nutritionExtras?.proteins ?? 0;
      const fiber = nutritionExtras?.fiber ?? 0;
      const sugar = nutritionExtras?.sugar ?? 0;
      const sodium = nutritionExtras?.sodium ?? 0;
      const satFat = nutritionExtras?.saturatedFats ?? 0;

      if (protein >= 15)
        healthNotes.push(
          preferredLanguage === 'vi'
            ? 'Giàu đạm (tốt cho no lâu).'
            : 'High protein (good satiety).',
        );
      if (fiber >= 5)
        healthNotes.push(
          preferredLanguage === 'vi'
            ? 'Khá giàu chất xơ.'
            : 'Good fiber content.',
        );
      if (sugar >= 15)
        healthNotes.push(
          preferredLanguage === 'vi'
            ? 'Khá nhiều đường — cân nhắc giảm khẩu phần.'
            : 'Relatively high sugar — consider smaller portion.',
        );
      if (sodium >= 600)
        healthNotes.push(
          preferredLanguage === 'vi'
            ? 'Natri hơi cao — uống đủ nước và cân đối bữa còn lại.'
            : 'Sodium is on the higher side — balance the rest of the day.',
        );
      if (satFat >= 5)
        healthNotes.push(
          preferredLanguage === 'vi'
            ? 'Chất béo bão hoà tương đối cao — ưu tiên thêm rau/xơ.'
            : 'Saturated fat is notable — add veggies/fiber.',
        );
      if (!healthNotes.length) {
        healthNotes.push(
          preferredLanguage === 'vi'
            ? 'Nhìn chung ổn; để kết luận “healthy” còn cần mục tiêu (giảm cân/tăng cơ/bệnh nền) và khẩu phần cả ngày.'
            : 'Seems reasonable; “healthy” also depends on your goals and the whole-day portions.',
        );
      }

      const header =
        preferredLanguage === 'vi'
          ? [`Món: ${food?.name || 'Không rõ'}`, `Khẩu phần: ${unitLabel}`]
          : [`Food: ${food?.name || 'Unknown'}`, `Serving: ${unitLabel}`];

      const macroLines =
        preferredLanguage === 'vi'
          ? [
              `Calories: ${calories}`,
              `Carbs: ${nutritionExtras?.carbs ?? 0}g`,
              `Protein: ${protein}g`,
              `Fat: ${nutritionExtras?.fats ?? nutritionExtras?.fat ?? 0}g`,
              `Prep: ${food?.property?.prepTime ?? 0}m`,
              `Cook: ${food?.property?.cookTime ?? 0}m`,
            ]
          : [
              `Calories: ${calories}`,
              `Carbs: ${nutritionExtras?.carbs ?? 0}g`,
              `Protein: ${protein}g`,
              `Fat: ${nutritionExtras?.fats ?? nutritionExtras?.fat ?? 0}g`,
              `Prep: ${food?.property?.prepTime ?? 0}m`,
              `Cook: ${food?.property?.cookTime ?? 0}m`,
            ];

      const blocks: string[] = [];
      blocks.push(header.join('\n'));

      if (ingredientLines.length) {
        blocks.push(
          preferredLanguage === 'vi'
            ? `Thành phần (theo công thức):\n${ingredientLines.join('\n')}`
            : `Ingredients (from recipe):\n${ingredientLines.join('\n')}`,
        );
      }

      if (directionLines.length) {
        blocks.push(
          preferredLanguage === 'vi'
            ? `Cách làm (tóm tắt):\n${directionLines.join('\n')}`
            : `Directions (summary):\n${directionLines.join('\n')}`,
        );
      }

      blocks.push(macroLines.join('\n'));

      blocks.push(
        preferredLanguage === 'vi'
          ? `Đánh giá “healthy” (nhanh):\n- ${healthNotes.join('\n- ')}`
          : `Healthy check (quick):\n- ${healthNotes.join('\n- ')}`,
      );

      if (
        external?.ingredientsText ||
        external?.nutriScoreGrade ||
        external?.allergens
      ) {
        const extLines = [
          external.productName ? `Product: ${external.productName}` : null,
          external.nutriScoreGrade
            ? `Nutri-Score: ${external.nutriScoreGrade}`
            : null,
          external.allergens ? `Allergens: ${external.allergens}` : null,
          external.ingredientsText
            ? `Ingredients (external): ${external.ingredientsText}`
            : null,
        ].filter(Boolean) as string[];

        blocks.push(
          preferredLanguage === 'vi'
            ? `Tra cứu bên ngoài (OpenFoodFacts, nếu khớp tên):\n${extLines.join('\n')}`
            : `External lookup (OpenFoodFacts, if name matches):\n${extLines.join('\n')}`,
        );
      }

      blocks.push(
        preferredLanguage === 'vi'
          ? 'Nếu bạn nói rõ mục tiêu (giảm cân/tăng cơ/tiểu đường…), mình đánh giá kỹ hơn và gợi ý thay món/khẩu phần.'
          : 'If you share your goal (fat loss/muscle gain/diabetes…), I can give a more tailored assessment and swap/portion suggestions.',
      );

      return blocks.join('\n\n');
    },
    [preferredLanguage],
  );

  const fetchDetailedFood = useCallback(async (foodId: string) => {
    const response = await fetch(getFoodEndpoint(foodId), {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      throw new Error(`Food detail error: ${response.status}`);
    }
    const data = await response.json();
    return (data?.data ?? data) as DetailedFoodResponse;
  }, []);

  const fetchExternalFoodFacts = useCallback(async (foodName: string) => {
    const query = encodeURIComponent(foodName);
    const url = `https://world.openfoodfacts.org/cgi/search.pl?search_simple=1&action=process&json=1&page_size=1&search_terms=${query}`;
    const response = await fetch(url, { method: 'GET' });
    if (!response.ok) return null;
    const data = await response.json();
    const product = data?.products?.[0];
    if (!product) return null;
    return {
      source: 'openfoodfacts' as const,
      productName: product.product_name as string | undefined,
      ingredientsText: product.ingredients_text as string | undefined,
      allergens: product.allergens as string | undefined,
      nutriScoreGrade: product.nutriscore_grade as string | undefined,
    };
  }, []);

  const commitMealPlanUpdate = useCallback(
    async (
      mealDate: string,
      mealPlanDay: MealPlanDay,
      successMessage: string,
      flashIds?: string[],
      recordUndo: boolean = true,
    ) => {
      const previousState = findMealPlanDay(mealDate);

      dispatch(
        updateViewingMealPlanByDates({
          mealPlanWithDates: [{ mealDate, mealPlanDay }],
        }),
      );
      dispatch(
        updateCacheMealPlanByDate({
          mealPlanWithDate: { mealDate, mealPlanDay },
        }),
      );

      try {
        const response = await updateMealPlan({
          mealPlan: getMealPlanDayDatabaseDTOByMealPlanDay(mealPlanDay),
        }).unwrap();

        if (!response.success) {
          throw new Error('Update failed');
        }

        if (recordUndo && previousState?._id) {
          pushUndoEntry({
            mealDate,
            previousMealPlanDay: previousState,
            description: successMessage,
            timestamp: Date.now(),
          });
        }

        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: successMessage },
        ]);
        if (flashIds?.length) {
          triggerFlash(flashIds);
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Unknown error';
        showToastError(`Không thể cập nhật thực đơn: ${errorMessage}`);
        dispatch(
          updateViewingMealPlanByDates({
            mealPlanWithDates: [{ mealDate, mealPlanDay: previousState }],
          }),
        );
        dispatch(
          updateCacheMealPlanByDate({
            mealPlanWithDate: { mealDate, mealPlanDay: previousState },
          }),
        );
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: 'Có lỗi khi cập nhật thực đơn. Bạn thử lại giúp mình nhé.',
          },
        ]);
      }
    },
    [dispatch, findMealPlanDay, pushUndoEntry, triggerFlash, updateMealPlan],
  );

  const handleMealAction = useCallback(
    async (action: MealAction) => {
      if (action.type === 'message') {
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: action.text },
        ]);
        return;
      }

      if (action.type === 'apply_swap_option') {
        if (!pendingSwap) {
          setMessages((prev) => [
            ...prev,
            {
              role: 'assistant',
              content: 'No pending options to apply.',
            },
          ]);
          return;
        }
        await applySwapOption(pendingSwap, action.optionIndex);
        return;
      }

      const mealDate = action.mealDate ?? defaultMealDate;
      const mealPlanDay = findMealPlanDay(mealDate);

      if (!mealPlanDay) {
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: `Chưa có thực đơn cho ngày ${mealDate}.`,
          },
        ]);
        return;
      }
      if (action.type === 'food_info') {
        const items = mealPlanDay.mealItems[action.mealType];
        const targetIndex = action.targetIndex - 1;
        if (
          !Number.isInteger(targetIndex) ||
          targetIndex < 0 ||
          targetIndex >= items.length
        ) {
          setMessages((prev) => [
            ...prev,
            {
              role: 'assistant',
              content: 'Food index is not valid.',
            },
          ]);
          return;
        }

        const mealItem = items[targetIndex];
        const foodId = mealItem.foodId?._id;
        let detailed: DetailedFoodResponse['data'] | null = null;
        let external: {
          source: 'openfoodfacts';
          productName?: string;
          ingredientsText?: string;
          allergens?: string;
          nutriScoreGrade?: string;
        } | null = null;

        try {
          if (foodId) {
            const detailRes = await fetchDetailedFood(foodId);
            detailed = detailRes?.data ?? null;
          }
        } catch {
          detailed = null;
        }

        try {
          const name = mealItem.foodId?.name;
          if (name) {
            external = await fetchExternalFoodFacts(name);
          }
        } catch {
          external = null;
        }

        const info = buildFoodInfoMessage(mealItem, detailed, external);
        setMessages((prev) => [...prev, { role: 'assistant', content: info }]);
        return;
      }

      if (action.type === 'replace_food') {
        const items = mealPlanDay.mealItems[action.mealType];
        const targetIndex = action.targetIndex - 1;
        if (
          !Number.isInteger(targetIndex) ||
          targetIndex < 0 ||
          targetIndex >= items.length
        ) {
          setMessages((prev) => [
            ...prev,
            {
              role: 'assistant',
              content: 'Food index is not valid.',
            },
          ]);
          return;
        }

        const targetItem = items[targetIndex];
        const latestUserText =
          [...messages].reverse().find((m) => m.role === 'user')?.content ?? '';
        const inferredFilters = inferSwapFiltersFromText(latestUserText);
        const mergedFilters: SwapModalFilters = {
          ...inferredFilters,
          ...(action.filters ?? {}),
        };
        if (typeof action.replacementQuery === 'string') {
          const trimmed = action.replacementQuery.trim();
          if (trimmed) mergedFilters.q = trimmed;
        }

        try {
          dispatch(
            openSwapModal({
              swapType: 'food',
              mealPlanId: mealPlanDay._id,
              mealDate,
              mealType: action.mealType,
              targetItemId: targetItem._id,
              targetFoodId: targetItem.foodId?._id,
              filters: mergedFilters,
            }),
          );
          dispatch(setSwapModalFilters({ filters: mergedFilters }));
          dispatch(setSwapModalLoading({ loading: true }));

          const { swapOptions } = await fetchSwapOptions(
            mealPlanDay,
            action.mealType,
            targetIndex,
            action.limit,
            action.tolerance,
          );

          if (!swapOptions.options?.length) {
            dispatch(setSwapModalData({ data: null }));
            setMessages((prev) => [
              ...prev,
              {
                role: 'assistant',
                content: 'No alternate options found for this food.',
              },
            ]);
            return;
          }

          // Feed options into the shared modal.
          dispatch(
            setSwapModalData({
              data: swapOptions as unknown as PlannerSwapOptionsResponse,
            }),
          );

          setMessages((prev) => [
            ...prev,
            {
              role: 'assistant',
              content:
                preferredLanguage === 'vi'
                  ? 'Mình đã mở danh sách thay thế. Bạn chọn món phù hợp trong popup nhé.'
                  : 'I opened the replacement list. Please choose an option in the popup.',
            },
          ]);
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : 'Unknown error';
          showToastError(`Swap options failed: ${errorMessage}`);
          dispatch(closeSwapModal());
          setMessages((prev) => [
            ...prev,
            {
              role: 'assistant',
              content:
                preferredLanguage === 'vi'
                  ? 'Không lấy được danh sách gợi ý thay thế. Bạn thử lại giúp mình nhé.'
                  : 'Could not fetch alternate options. Please try again.',
            },
          ]);
        } finally {
          dispatch(setSwapModalLoading({ loading: false }));
        }
        return;
      }

      if (action.type === 'reorder') {
        const items = mealPlanDay.mealItems[action.mealType];
        const fromIndex = action.fromIndex - 1;
        const toIndex = action.toIndex - 1;

        if (
          !Number.isInteger(fromIndex) ||
          !Number.isInteger(toIndex) ||
          fromIndex < 0 ||
          fromIndex >= items.length ||
          toIndex < 0 ||
          toIndex >= items.length
        ) {
          setMessages((prev) => [
            ...prev,
            {
              role: 'assistant',
              content:
                'Vị trí món không hợp lệ. Bạn kiểm tra lại chỉ số giúp mình nhé.',
            },
          ]);
          return;
        }

        if (fromIndex === toIndex) {
          setMessages((prev) => [
            ...prev,
            {
              role: 'assistant',
              content: 'Món đã ở đúng vị trí rồi.',
            },
          ]);
          return;
        }

        const affectedIds = collectIdsInRange(items, fromIndex, toIndex);

        const updatedItems = moveItem(items, fromIndex, toIndex);
        const updatedMealPlanDay = {
          ...mealPlanDay,
          mealItems: {
            ...mealPlanDay.mealItems,
            [action.mealType]: updatedItems,
          },
        };

        await commitMealPlanUpdate(
          mealDate,
          updatedMealPlanDay,
          `Đã cập nhật ${MEAL_TYPE_LABELS[action.mealType]} cho ngày ${mealDate}.`,
          affectedIds.length ? affectedIds : undefined,
        );
        return;
      }

      if (action.type === 'swap') {
        const items = mealPlanDay.mealItems[action.mealType];
        const indexA = action.indexA - 1;
        const indexB = action.indexB - 1;

        if (
          !Number.isInteger(indexA) ||
          !Number.isInteger(indexB) ||
          indexA < 0 ||
          indexA >= items.length ||
          indexB < 0 ||
          indexB >= items.length
        ) {
          setMessages((prev) => [
            ...prev,
            {
              role: 'assistant',
              content:
                'Vị trí món không hợp lệ. Bạn kiểm tra lại chỉ số giúp mình nhé.',
            },
          ]);
          return;
        }

        if (indexA === indexB) {
          setMessages((prev) => [
            ...prev,
            {
              role: 'assistant',
              content: 'Hai vị trí giống nhau nên không cần đổi.',
            },
          ]);
          return;
        }

        const flashIds = [items[indexA]?._id, items[indexB]?._id].filter(
          Boolean,
        ) as string[];

        const updatedItems = swapItems(items, indexA, indexB);
        const updatedMealPlanDay = {
          ...mealPlanDay,
          mealItems: {
            ...mealPlanDay.mealItems,
            [action.mealType]: updatedItems,
          },
        };

        await commitMealPlanUpdate(
          mealDate,
          updatedMealPlanDay,
          `Đã đổi vị trí ${MEAL_TYPE_LABELS[action.mealType]} cho ngày ${mealDate}.`,
          flashIds.length ? flashIds : undefined,
        );
        return;
      }

      if (action.type === 'move') {
        const sourceItems = mealPlanDay.mealItems[action.fromMealType];
        const fromIndex = action.fromIndex - 1;
        const toIndex = action.toIndex - 1;
        const destinationItems = mealPlanDay.mealItems[action.toMealType];

        if (
          !Number.isInteger(fromIndex) ||
          fromIndex < 0 ||
          fromIndex >= sourceItems.length
        ) {
          setMessages((prev) => [
            ...prev,
            {
              role: 'assistant',
              content: 'Vị trí món nguồn không hợp lệ. Bạn kiểm tra lại nhé.',
            },
          ]);
          return;
        }

        if (
          !Number.isInteger(toIndex) ||
          toIndex < 0 ||
          toIndex >= destinationItems.length + 1
        ) {
          setMessages((prev) => [
            ...prev,
            {
              role: 'assistant',
              content: 'Vị trí món đích không hợp lệ. Bạn kiểm tra lại nhé.',
            },
          ]);
          return;
        }

        const movedId = sourceItems[fromIndex]?._id;
        const sourceNeighborId =
          action.fromMealType === action.toMealType
            ? undefined
            : sourceItems[fromIndex + 1]?._id;
        const destNeighborId =
          action.fromMealType === action.toMealType
            ? undefined
            : destinationItems[toIndex]?._id;

        const updatedMealPlanDay =
          action.fromMealType === action.toMealType
            ? {
                ...mealPlanDay,
                mealItems: {
                  ...mealPlanDay.mealItems,
                  [action.fromMealType]: moveItem(
                    sourceItems,
                    fromIndex,
                    Math.min(toIndex, sourceItems.length - 1),
                  ),
                },
              }
            : getMealPlanDayAfterAddAndRemoveMealItem(
                mealPlanDay,
                action.fromMealType,
                fromIndex,
                action.toMealType,
                Math.min(toIndex, destinationItems.length),
              );

        if (!updatedMealPlanDay._id) {
          setMessages((prev) => [
            ...prev,
            {
              role: 'assistant',
              content:
                'Không thể cập nhật thực đơn do thiếu dữ liệu. Bạn thử lại nhé.',
            },
          ]);
          return;
        }

        await commitMealPlanUpdate(
          mealDate,
          updatedMealPlanDay,
          `Đã cập nhật thực đơn ngày ${mealDate}.`,
          [movedId, sourceNeighborId, destNeighborId].filter(Boolean) as
            | string[]
            | undefined,
        );
      }
    },
    [
      applySwapOption,
      buildFoodInfoMessage,
      commitMealPlanUpdate,
      defaultMealDate,
      fetchSwapOptions,
      findMealPlanDay,
      pendingSwap,
    ],
  );

  const handleSend = useCallback(async () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    const detected = detectLanguage(trimmed);
    setPreferredLanguage(detected);

    if (isRevertCommand(trimmed)) {
      const steps = parseRevertSteps(trimmed);
      setMessages((prev) => [...prev, { role: 'user', content: trimmed }]);
      setInput('');
      setIsLoading(true);
      try {
        let lastEntry: UndoEntry | undefined;
        setUndoStack((prev) => {
          const next = [...prev];
          for (let i = 0; i < steps; i += 1) {
            lastEntry = next.pop();
          }
          return next;
        });

        if (!lastEntry) {
          setMessages((prev) => [
            ...prev,
            {
              role: 'assistant',
              content:
                detected === 'vi'
                  ? 'Hiện chưa có thay đổi nào để hoàn tác.'
                  : 'There is no recent change to undo.',
            },
          ]);
          return;
        }

        await commitMealPlanUpdate(
          lastEntry.mealDate,
          lastEntry.previousMealPlanDay,
          detected === 'vi'
            ? 'Đã hoàn tác thay đổi gần nhất.'
            : 'Undid the most recent change.',
          undefined,
          false,
        );
      } finally {
        setIsLoading(false);
      }
      return;
    }

    const optionIndex = pendingSwap ? parseOptionSelection(trimmed) : null;
    if (pendingSwap && optionIndex) {
      setMessages((prev) => [...prev, { role: 'user', content: trimmed }]);
      setInput('');
      setIsLoading(true);
      try {
        await applySwapOption(pendingSwap, optionIndex);
      } finally {
        setIsLoading(false);
      }
      return;
    }

    const history = buildChatHistory(messages, MAX_HISTORY);

    setMessages((prev) => [...prev, { role: 'user', content: trimmed }]);
    setInput('');
    setIsLoading(true);

    try {
      const action = await requestMarketplaceAction(
        trimmed,
        history,
        pendingSwap,
      );
      await handleMealAction(action);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            detected === 'vi'
              ? 'Mình gặp lỗi khi gọi trợ lý AI. Bạn thử lại giúp mình nhé.'
              : 'AI request failed. Please try again.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [
    applySwapOption,
    handleMealAction,
    input,
    isLoading,
    messages,
    pendingSwap,
    requestMarketplaceAction,
    commitMealPlanUpdate,
  ]);

  const handleNewChat = useCallback(() => {
    setMessages(createInitialMessages(preferredLanguage));
    setInput('');
    setPendingSwap(null);
    setIsLoading(false);
  }, [preferredLanguage, setInput, setIsLoading, setMessages, setPendingSwap]);

  const shouldShowHelpHint = useMemo(() => {
    if (panelVisible) return false;
    if (closeCount === 0) return true;
    const lastUser = [...messages].reverse().find((m) => m.role === 'user');
    const looksConfused = lastUser
      ? /(help|how|why|what|khong hieu|không hiểu|giup|giúp|làm sao|sao vậy|rối|confus)/i.test(
          lastUser.content,
        )
      : false;
    return looksConfused || closeCount % 3 === 0;
  }, [closeCount, messages, panelVisible]);

  const helpHintText = useMemo(() => {
    const hints = HELP_HINTS[preferredLanguage];
    return hints[closeCount % hints.length];
  }, [closeCount, preferredLanguage]);

  const animatedAvatarUrl = useMemo(() => {
    if (assistantAnimation === 'hello') {
      return env.NUTRIBOT_HELLO_URL || env.NUTRIBOT_THINKING_URL;
    }
    if (assistantAnimation === 'neutral') {
      return env.NUTRIBOT_NEUTRAL_URL || env.NUTRIBOT_TALKING_URL;
    }
    if (assistantAnimation === 'done') {
      return env.NUTRIBOT_DONE_URL || env.NUTRIBOT_HAPPY_URL;
    }
    if (assistantAnimation === 'sad') {
      return env.NUTRIBOT_SAD_URL;
    }
    return env.NUTRIBOT_IDLE_URL;
  }, [assistantAnimation]);

  useEffect(() => {
    let canceled = false;
    const preload = async () => {
      if (!animatedAvatarUrl) {
        setAvatarLoaded(true);
        return;
      }
      setAvatarLoaded(false);
      try {
        await fetch(animatedAvatarUrl, { mode: 'no-cors' });
      } catch {
        // best-effort preload; ignore failures
      } finally {
        if (!canceled) {
          setAvatarLoaded(true);
        }
      }
    };

    preload();
    return () => {
      canceled = true;
    };
  }, [animatedAvatarUrl]);

  const robotMood = useMemo(() => {
    const lastAssistant = [...messages]
      .reverse()
      .find((m) => m.role === 'assistant')?.content;
    if (!lastAssistant) return 'neutral' as const;
    if (/(tuyệt|tốt|ổn|great|nice|good job|excellent)/i.test(lastAssistant)) {
      return 'happy' as const;
    }
    if (/(lỗi|thất bại|không thể|error|failed|sorry)/i.test(lastAssistant)) {
      return 'sad' as const;
    }
    return 'neutral' as const;
  }, [messages]);

  const NutriBotAvatar = useCallback(
    ({ width, height }: { width: number; height: number }) => {
      if (
        typeof animatedAvatarUrl === 'string' &&
        animatedAvatarUrl.trim().length > 0
      ) {
        const shouldLoop =
          assistantAnimation === 'idle' || assistantAnimation === 'neutral';
        return (
          <div
            className='overflow-hidden rounded-[32px]'
            style={{ width, height }}
          >
            <DotLottieReact
              key={animatedAvatarUrl}
              src={animatedAvatarUrl}
              autoplay
              loop={shouldLoop}
              aria-hidden='true'
              className='block select-none'
              style={{
                width,
                height,
                objectFit: 'contain',
              }}
            />
          </div>
        );
      }

      const moodForSvg =
        assistantAnimation === 'done'
          ? 'happy'
          : assistantAnimation === 'sad'
            ? 'sad'
            : robotMood;

      const eyeY = assistantAnimation === 'hello' ? 12 : 13;
      const mouthPath =
        moodForSvg === 'happy'
          ? 'M11 19 Q16 23 21 19'
          : moodForSvg === 'sad'
            ? 'M11 21 Q16 17 21 21'
            : 'M12 20 H20';

      return (
        <svg
          width={width}
          height={height}
          viewBox='6 2 20 24'
          aria-hidden='true'
          className={
            assistantAnimation === 'neutral'
              ? 'animate-pulse'
              : assistantAnimation === 'hello'
                ? 'animate-bounce'
                : ''
          }
        >
          <rect
            x='6.5'
            y='7'
            width='19'
            height='18'
            rx='7'
            className='fill-gray-200'
          />
          <rect
            x='9'
            y='10'
            width='14'
            height='10'
            rx='5'
            className='fill-white'
          />
          <circle cx='13' cy={eyeY} r='1.3' className='fill-gray-700' />
          <circle cx='19' cy={eyeY} r='1.3' className='fill-gray-700' />
          <path
            d={mouthPath}
            className='stroke-gray-700'
            strokeWidth='1.6'
            fill='none'
            strokeLinecap='round'
          />
          <path
            d='M16 5 V7'
            className='stroke-gray-500'
            strokeWidth='1.6'
            strokeLinecap='round'
          />
          <circle cx='16' cy='4' r='1.6' className='fill-gray-400' />
        </svg>
      );
    },
    [assistantAnimation, robotMood, animatedAvatarUrl],
  );

  const avatarWidth = isOpen ? AVATAR_WIDTH_OPEN : AVATAR_WIDTH_DEFAULT;
  const avatarHeight = isOpen ? AVATAR_HEIGHT_OPEN : AVATAR_HEIGHT_DEFAULT;
  const containerWidth = avatarWidth;
  const containerHeight = avatarHeight;

  const avatarVariants = {
    closed: { opacity: 1, scale: 1, y: 0, rotate: 0 },
    open: { opacity: 1, scale: 1.08, y: -6, rotate: -2 },
    hidden: { opacity: 0, scale: 0.9, y: 6 },
  } as const;

  return (
    <div className='fixed right-6 bottom-6 z-[70] flex flex-col items-end gap-1'>
      {shouldShowHelpHint && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28 }}
          className='rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-gray-600 shadow-sm'
        >
          {helpHintText}
        </motion.div>
      )}

      {panelVisible && (
        <motion.div
          initial={{ opacity: 0, y: 12, scale: 0.98 }}
          animate={{
            opacity: isOpen ? 1 : 0,
            y: isOpen ? 0 : 12,
            scale: isOpen ? 1 : 0.98,
            pointerEvents: isOpen ? 'auto' : 'none',
          }}
          transition={{ duration: 0.24 }}
          className='flex h-[420px] w-[360px] max-w-[90vw] flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl'
        >
          <div className='bg-primary-100 flex items-center justify-between border-b border-gray-200 px-4 py-3'>
            <div className='flex items-center gap-2 text-sm font-bold text-gray-800'>
              NutriBot
            </div>
            <div className='flex items-center gap-2'>
              <button
                className='rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-semibold text-gray-600 hover:bg-gray-50'
                onClick={handleNewChat}
                type='button'
              >
                {preferredLanguage === 'vi' ? 'Chat mới' : 'New chat'}
              </button>
              <button
                className='rounded-full p-2 text-gray-600 hover:bg-gray-100'
                onClick={handleToggleChat}
                aria-label='Close chatbot'
                type='button'
              >
                <FaTimes />
              </button>
            </div>
          </div>

          <div className='flex-1 space-y-3 overflow-y-auto px-4 py-3 text-sm'>
            {messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={`flex ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3 py-2 leading-relaxed whitespace-pre-line ${
                    message.role === 'user'
                      ? 'bg-primary text-black'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className='text-xs text-gray-500'>
                {preferredLanguage === 'vi' ? 'Đang xử lý...' : 'Processing...'}
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className='border-t border-gray-200 px-3 py-3'>
            <div className='flex items-end gap-2'>
              <textarea
                rows={2}
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' && !event.shiftKey) {
                    event.preventDefault();
                    handleSend();
                  }
                }}
                className='focus:border-primary-400 flex-1 resize-none rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none'
                placeholder={
                  preferredLanguage === 'vi'
                    ? 'Ví dụ: Đổi món 1 và 3 trong bữa sáng hôm nay'
                    : 'Example: Swap item 1 and 3 in today breakfast'
                }
              />
              <button
                className='bg-primary flex h-10 w-10 items-center justify-center rounded-full text-black disabled:cursor-not-allowed disabled:bg-gray-200'
                onClick={handleSend}
                type='button'
                aria-label='Send'
                disabled={!input.trim() || isLoading}
              >
                <FaPaperPlane />
              </button>
            </div>
          </div>
        </motion.div>
      )}

      <motion.button
        className='flex items-center justify-center rounded-[36px] bg-transparent shadow-none'
        style={{
          width: containerWidth,
          height: containerHeight,
          pointerEvents: isOpen ? 'none' : 'auto',
        }}
        onClick={handleToggleChat}
        aria-label='Open chatbot'
        type='button'
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        animate={{
          scale: isOpen ? 1 : 1,
          rotate: 0,
          translateY: isOpen ? '10%' : '0%',
          opacity: avatarLoaded ? 1 : 0,
        }}
        transition={{ duration: 0.44, ease: 'easeOut' }}
      >
        <AnimatePresence mode='wait'>
          {avatarLoaded ? (
            <motion.div
              key={assistantAnimation + (animatedAvatarUrl || '')}
              variants={avatarVariants}
              initial='hidden'
              animate={isOpen ? 'open' : 'closed'}
              exit='hidden'
              transition={{
                type: 'spring',
                stiffness: 120,
                damping: 16,
                mass: 0.6,
              }}
            >
              <NutriBotAvatar width={avatarWidth} height={avatarHeight} />
            </motion.div>
          ) : (
            <motion.div
              key='avatar-loading'
              className='animate-pulse rounded-full bg-white/60 shadow-lg'
              style={{ width: avatarWidth, height: avatarHeight }}
              initial={{ opacity: 0.4 }}
              animate={{ opacity: 0.8 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
            />
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
};

export default MealPlanChatbot;
