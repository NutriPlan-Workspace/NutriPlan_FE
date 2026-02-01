import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { FaPaperPlane, FaSpinner, FaTimes } from 'react-icons/fa';
import ReactMarkdown from 'react-markdown';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from '@tanstack/react-router';
import { AnimatePresence, motion } from 'motion/react';
import remarkGfm from 'remark-gfm';

import { env } from '@/configs/env';
import { ChatMessage, Language, useChatContext } from '@/contexts/ChatContext';
import { useDate } from '@/contexts/DateContext';
import {
  useApplySwapMutation,
  useGetSwapOptionsMutation,
  useLazyGetMealPlanSingleDayQuery,
  useUpdateMealPlanMutation,
} from '@/redux/query/apis/mealPlan/mealPlanApi';
import { useUpsertPantryItemMutation } from '@/redux/query/apis/pantry/pantryApi';
import {
  closeSwapModal,
  mealPlanSelector,
  openSwapModal,
  setDockSearchQuery,
  setFlashMealCardIds,
  setIsDockExpanded,
  setSwapModalData,
  setSwapModalFilters,
  setSwapModalLoading,
  type SwapModalFilters,
  updateCacheMealPlanByDate,
  updateViewingMealPlanByDates,
} from '@/redux/slices/mealPlan';
import { ChatbotCommandParams } from '@/types/chatbot';
import type { DetailedFoodResponse, Food } from '@/types/food';
import type { MealPlanDay, MealPlanFood } from '@/types/mealPlan';
import type {
  SwapOptionsRequest,
  SwapOptionsResponse as PlannerSwapOptionsResponse,
} from '@/types/mealSwap';
import { getMealDate } from '@/utils/dateUtils';
import {
  getMealPlanDayAfterAddAndRemoveMealItem,
  getMealPlanDayDatabaseDTOByMealPlanDay,
} from '@/utils/mealPlan';
import { showToastError } from '@/utils/toastUtils';

// --- 1. Keyframes & Animation Styles (Shimmer) ---
const shimmerStyles = `
  @keyframes thinking-wave {
    0% {
      background-position: 0% 50%;
      opacity: 0.75;
    }
    50% {
      background-position: 100% 50%;
      opacity: 1;
    }
    100% {
      background-position: 0% 50%;
      opacity: 0.75;
    }
  }

  .shimmer-text {
    background: linear-gradient(
      110deg,
      #6b7280 0%,
      #6b7280 35%,
      #d1d5db 50%,
      #6b7280 65%,
      #6b7280 100%
    );
    background-size: 300% 100%;

    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;

    animation: thinking-wave 4.5s linear infinite;
  }

  .shimmer-text p,
  .shimmer-text span,
  .shimmer-text li,
  .shimmer-text strong,
  .shimmer-text em {
    background: inherit;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
`;

type MealType = 'breakfast' | 'lunch' | 'dinner';

// Types moved to ChatContext

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
  | {
      type: 'get_meal_plan';
      mealDate: string;
    }
  | {
      type: 'add_to_grocery';
      ingredients: { name: string; quantity?: number; unit?: string }[];
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

const MEAL_TYPE_LABELS: Record<MealType, string> = {
  breakfast: 'bữa sáng',
  lunch: 'bữa trưa',
  dinner: 'bữa tối',
};

const buildSystemPrompt = (
  language: Language,
) => `You are the NutriPlan assistant.
If you need to perform an action (swap, reorder, move, replace, food_info), return ONLY valid JSON.
If you are chatting, explaining, or answering a question, return PLAIN TEXT (do not wrap in JSON).
Always respond in the same language as the user's latest message. The user's language is: ${
  language === 'vi' ? 'Vietnamese' : 'English'
}.
IMPORTANT: If the user asks to swap/replace with a specific food name in Vietnamese (e.g. "đổi sang Trứng", "thay bằng Phở"), you MUST translate the food name to English for the 'replacementQuery' field in JSON (e.g. "Egg", "Pho").
Supported JSON actions:
- {"type":"reorder","mealDate":"YYYY-MM-DD","mealType":"breakfast|lunch|dinner","fromIndex":1,"toIndex":3}
- {"type":"swap","mealDate":"YYYY-MM-DD","mealType":"breakfast|lunch|dinner","indexA":1,"indexB":3}
- {"type":"move","mealDate":"YYYY-MM-DD","fromMealType":"breakfast|lunch|dinner","fromIndex":1,"toMealType":"breakfast|lunch|dinner","toIndex":2}
- {"type":"replace_food","mealDate":"YYYY-MM-DD","mealType":"breakfast|lunch|dinner","targetIndex":1,"limit":5,"tolerance":0.2,"replacementQuery":"optional", "filters":{"q":"...","dishType":"main|side","categoryIds":[1,2]}}
- {"type":"apply_swap_option","optionIndex":1}
- {"type":"food_info","mealDate":"YYYY-MM-DD","mealType":"breakfast|lunch|dinner","targetIndex":1}
- {"type":"get_meal_plan","mealDate":"YYYY-MM-DD"} (Use this IMMEDIATELY if the user mentions a date different from the provided 'Default date'. Do not ask for confirmation).

Use 1-based indices. If you are unsure, just ask in plain text.`;

const DEFAULT_API_BASE_URL = 'http://localhost:3000/api';

const FOODS_PATH = '/foods';
const getAiEndpoint = () => env.AI_SERVICE_URL;
const getFoodEndpoint = (foodId: string) =>
  `${env.API_BASE_URL || DEFAULT_API_BASE_URL}${FOODS_PATH}/${foodId}`;

const isMealType = (value: unknown): value is MealType =>
  value === 'breakfast' || value === 'lunch' || value === 'dinner';

const toNumber = (value: unknown) =>
  typeof value === 'number' ? value : Number(value);

const convertFrontendCommandToMealAction = (
  parsed: unknown,
): MealAction | null => {
  const p = parsed as {
    type: string;
    action: string;
    params?: Record<string, unknown>;
  };
  if (p.type !== 'FRONTEND_COMMAND') return null;
  const action = p.action;

  const params = (p.params || {}) as ChatbotCommandParams;

  if (action === 'add_to_grocery') {
    return { type: 'add_to_grocery', ingredients: params.ingredients ?? [] };
  }
  if (action === 'reorder' && isMealType(params.mealType)) {
    return {
      type: 'reorder',
      mealDate: params.mealDate,
      mealType: String(params.mealType).toLowerCase() as MealType,
      fromIndex: toNumber(params.fromIndex) || toNumber(params.newOrder?.[0]),
      toIndex: toNumber(params.toIndex) || toNumber(params.newOrder?.[1]),
    };
  }
  if (action === 'replace_food') {
    return {
      type: 'replace_food',
      mealDate: params.mealDate,
      mealType: String(params.mealType).toLowerCase() as MealType,
      targetIndex: toNumber(params.targetIndex),
      replacementQuery: params.replacementQuery,
      limit: params.limit !== undefined ? toNumber(params.limit) : undefined,
      tolerance:
        params.tolerance !== undefined ? Number(params.tolerance) : undefined,
      autoPick: params.autoPick,
      filters: params.filters,
    };
  }
  if (action === 'food_info') {
    return {
      type: 'food_info',
      mealDate: params.mealDate,
      mealType: params.mealType as MealType,
      targetIndex: toNumber(params.targetIndex),
    };
  }
  // NEW: Support swap_food (mapped to replace_food logic)
  if (action === 'swap_food') {
    // If we have strict from/to, we can treat it as replace_food.
    // If targetIndex is missing (which is likely from LLM),
    // we need to set a flag or special property to let handleMealAction infer it.
    // We'll reuse 'replace_food' but maybe pass filter data.
    return {
      type: 'replace_food',
      mealDate: params.mealDate,
      mealType: String(params.mealType).toLowerCase() as MealType,
      targetIndex: toNumber(params.targetIndex), // Might be NaN
      replacementQuery: params.to, // "to" becomes the search query
      // Store "from" name to find index if necessary
      filters: {
        q: params.to,
        fromName: params.from,
      } as unknown as SwapModalFilters,
    };
  }

  return null;
};

const parseMealAction = (rawText: string): MealAction => {
  if (!rawText) {
    return {
      type: 'message',
      text: 'Mình chưa nhận được phản hồi từ trợ lý. Bạn thử lại nhé.',
    };
  }

  const jsonMatch = rawText.match(/\{[\s\S]*\}/);
  // If no JSON found, or if the text is primarily a message, treat as plain text.
  if (!jsonMatch) {
    return {
      type: 'message',
      text: rawText,
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

    if (parsed.type === 'FRONTEND_COMMAND') {
      const converted = convertFrontendCommandToMealAction(parsed);
      if (converted) return converted;
    }

    if (
      parsed.type === 'get_meal_plan' &&
      typeof parsed.mealDate === 'string'
    ) {
      return {
        type: 'get_meal_plan',
        mealDate: parsed.mealDate,
      };
    }
  } catch {
    // If JSON parsing fails, assume it might be a text message that happens to have braces
    // or malformed JSON. We fallback to returning the raw text.
    return {
      type: 'message',
      text: rawText,
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

type MealPlanChatbotProps = {
  embedded?: boolean;
  initialMessage?: string | null;
  headerless?: boolean;
  resetNonce?: number | null;
  hideComposer?: boolean;
  externalMessage?: string | null;
  sendNonce?: number | null;
  onBack?: () => void;
};

type StreamEvent =
  | { status: 'thinking'; message: string }
  | { status: 'token'; content: string }
  | { status: 'done'; commands?: unknown[] }
  | { status: 'error'; message: string };

async function readNDJSONStream(
  response: Response,
  onEvent: (event: StreamEvent) => void,
): Promise<string> {
  const reader = response.body?.getReader();
  if (!reader) return '';
  const decoder = new TextDecoder();
  let buffer = '';
  let finalContent = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() || '';

    for (const line of lines) {
      if (!line.trim()) continue;
      try {
        const event = JSON.parse(line);
        onEvent(event);
        if (event.status === 'token' && event.content) {
          finalContent += event.content;
        }
      } catch {
        // ignore
      }
    }
  }
  return finalContent;
}

const MealPlanChatbot: React.FC<MealPlanChatbotProps> = ({
  embedded = false,
  initialMessage = null,
  headerless = false,
  resetNonce = null,
  hideComposer = false,
  externalMessage = null,
  sendNonce = null,
  onBack,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const {
    messages,
    setMessages,
    preferredLanguage,
    setPreferredLanguage,
    handleNewChat: resetChatContext,
  } = useChatContext();

  // sessionStorage logic removed as per user request to clear only on F5 (Context handles this)

  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastInitialMessageRef = useRef<string | null>(null);
  const panelVisible = embedded ? true : isOpen || isClosing;
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [pendingSwap, setPendingSwap] = useState<PendingSwap | null>(null);
  const avatarLoaded = true;
  const flashTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [undoStack, setUndoStack] = useState<UndoEntry[]>([]);
  const [closeCount, setCloseCount] = useState(0);
  const botAnimationTimerRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const [assistantAnimation, setAssistantAnimation] =
    useState<AssistantAnimationState>('idle');
  const [streamingReply, setStreamingReply] = useState<string>('');
  const [thinkingMessage, setThinkingMessage] = useState<string | null>(null);

  const lastResetNonceRef = useRef<number | null>(resetNonce);
  const lastSendNonceRef = useRef<number | null>(null);

  const { selectedDate } = useDate();
  const { viewingMealPlans } = useSelector(mealPlanSelector);
  const dispatch = useDispatch();
  const [updateMealPlan] = useUpdateMealPlanMutation();
  const [getMealPlanSingleDay] = useLazyGetMealPlanSingleDayQuery();
  const navigate = useNavigate();
  // const location = useLocation();
  const [upsertPantryItem] = useUpsertPantryItemMutation();
  const [getSwapOptions] = useGetSwapOptionsMutation();
  const [applySwap] = useApplySwapMutation();

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
  }, [messages, isLoading, isOpen, streamingReply]);

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

  const handleOpenChat = useCallback(() => {
    if (isOpen) return;

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

  useEffect(() => {
    if (embedded) return;
    const handleOpen = (e?: Event) => {
      const detail = (e as CustomEvent | undefined)?.detail as
        | { message?: string }
        | undefined;
      handleOpenChat();
      const msg = detail?.message;
      // message will be handled once `handleSend` is available
      if (msg) {
        // store pending message on window so the later listener can pick it up
        try {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (window as unknown as Record<string, any>).npPendingChatMessage = msg;
        } catch {
          // ignore
        }
      }
    };

    window.addEventListener('np:open-chatbot', handleOpen as EventListener);
    return () =>
      window.removeEventListener(
        'np:open-chatbot',
        handleOpen as EventListener,
      );
  }, [embedded, handleOpenChat]);

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
      onStream?: (event: StreamEvent) => void,
      contextDate?: string,
    ): Promise<MealAction> => {
      const targetDate = contextDate ?? defaultMealDate;
      // Removed automatic context injection as per user request to use Backend Fetching.
      const pendingInfo = formatPendingSwapOptions(pendingSwapState);
      const recentChanges = buildRecentChangesContext(undoStack);
      const systemPrompt = buildSystemPrompt(preferredLanguage);
      const prompt = `Date context: ${targetDate}
${pendingInfo ? `${pendingInfo}\n` : ''}${recentChanges ? `${recentChanges}\n` : ''}
Request: ${userMessage}`;
      const messagesPayload: AiChatMessage[] = [
        { role: 'system', content: systemPrompt },
        ...history,
        { role: 'user', content: prompt },
      ];

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      try {
        const storedToken = localStorage.getItem('accessToken');
        if (storedToken) headers['Authorization'] = `Bearer ${storedToken}`;
      } catch {
        // ignore
      }

      const response = await fetch(getAiEndpoint(), {
        method: 'POST',
        headers,
        credentials: 'include', // Send cookies for cross-origin requests
        body: JSON.stringify({
          messages: messagesPayload,
          temperature: 0.2, // Low temp for actions
          top_p: 1,
          stream: true,
        }),
      });

      if (!response.ok) {
        throw new Error(`AI API error: ${response.status}`);
      }

      await readNDJSONStream(response, (event) => {
        onStream?.(event);
      });

      // The 'done' event or accumulated tokens don't directly return the final command object here.
      // We rely on 'done' event usually containing the commands which we need to grab.
      // But readNDJSONStream returns the full text content.
      // We need to parse that content.
      // Wait, my readNDJSONStream implementation returns finalContent (string).
      // So I can just parse that.

      return { type: 'message', text: '' }; // Dummy return, logic handled in handleSend's callback accumulation
    },
    [defaultMealDate, preferredLanguage, undoStack],
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
      filters?: SwapModalFilters,
    ) => {
      const targetItem = mealPlanDay.mealItems[mealType][targetIndex];
      if (!targetItem) {
        throw new Error('Target item not found');
      }

      const payload: SwapOptionsRequest = {
        swapType: 'food',
        mealType,
        targetFoodId:
          typeof targetItem.foodId === 'string'
            ? targetItem.foodId
            : targetItem.foodId?._id,
        targetItemId: targetItem._id,
      };
      if (typeof limit === 'number' && !Number.isNaN(limit)) {
        payload.limit = limit;
      } else {
        payload.limit = 20;
      }
      if (typeof tolerance === 'number' && !Number.isNaN(tolerance)) {
        payload.tolerance = tolerance;
      } else {
        payload.tolerance = 0.2;
      }

      if (filters?.q) {
        payload.filters = { q: filters.q };
      }

      const data = await getSwapOptions({
        mealPlanId: mealPlanDay._id,
        payload,
      }).unwrap();
      // Handle case where transformResponse doesn't unwrap the API wrapper
      const swapData =
        (data as unknown as { data?: ChatbotSwapOptionsResponse }).data ?? data;

      return {
        swapOptions: swapData as ChatbotSwapOptionsResponse,
        targetItemId: targetItem._id,
      };
    },
    [getSwapOptions],
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
      const replacement: { foodId: string; amount?: number; unit?: number } = {
        foodId: option.foodId,
      };
      if (option.amount !== undefined) replacement.amount = option.amount;
      if (option.unit !== undefined) replacement.unit = option.unit;

      try {
        const previousState = findMealPlanDay(swapState.mealDate);

        const data = await applySwap({
          mealPlanId: swapState.mealPlanId,
          payload: {
            swapType: 'food',
            mealType: swapState.mealType,
            targetItemId: swapState.targetItemId,
            replacement,
          },
        }).unwrap();

        applyMealPlanFromServer(data);
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
      applySwap,
      findMealPlanDay,
      preferredLanguage,
      pushUndoEntry,
      setMessages,
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
    [
      dispatch,
      findMealPlanDay,
      pushUndoEntry,
      setMessages,
      triggerFlash,
      updateMealPlan,
    ],
  );

  const handleMealAction = useCallback(
    async (action: MealAction) => {
      // --- 1. Global Actions ---
      if (action.type === 'message') {
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: action.text },
        ]);
        return;
      }

      if (action.type === 'add_to_grocery') {
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content:
              preferredLanguage === 'vi'
                ? 'Đang thêm vào danh sách đi chợ...'
                : 'Adding to grocery list...',
          },
        ]);

        try {
          // Add all ingredients
          const promises = action.ingredients.map((ing) =>
            upsertPantryItem({
              name: ing.name,
              quantity: ing.quantity || 1,
              unit: ing.unit || 'serving',
              status: 'need_buy',
            }).unwrap(),
          );
          await Promise.all(promises);

          setMessages((prev) => [
            ...prev,
            {
              role: 'assistant',
              content:
                preferredLanguage === 'vi'
                  ? 'Đã thêm thành công!'
                  : 'Added successfully!',
            },
          ]);
        } catch {
          setMessages((prev) => [
            ...prev,
            {
              role: 'assistant',
              content:
                preferredLanguage === 'vi'
                  ? 'Có lỗi khi thêm vào giỏ.'
                  : 'Error adding to grocery list.',
            },
          ]);
        }
        return;
      }

      if (action.type === 'apply_swap_option') {
        if (!pendingSwap) {
          setMessages((prev) => [
            ...prev,
            { role: 'assistant', content: 'No pending options to apply.' },
          ]);
          return;
        }
        await applySwapOption(pendingSwap, action.optionIndex);
        return;
      }

      if (action.type === 'get_meal_plan') {
        try {
          await getMealPlanSingleDay({ date: action.mealDate }).unwrap();
        } catch {
          setMessages((prev) => [
            ...prev,
            {
              role: 'assistant',
              content:
                preferredLanguage === 'vi'
                  ? `Không thể tải dữ liệu ngày ${action.mealDate}.`
                  : `Could not load meal plan for ${action.mealDate}.`,
            },
          ]);
          return;
        }

        const latestUserText =
          [...messages].reverse().find((m) => m.role === 'user')?.content ?? '';

        if (!latestUserText) return;

        try {
          const history = buildChatHistory(messages, MAX_HISTORY);
          const nextAction = await requestMarketplaceAction(
            latestUserText,
            history,
            pendingSwap,
            (event: StreamEvent) => {
              if (event.status === 'token' && event.content) {
                setStreamingReply((prev) => prev + event.content);
              }
            },
            action.mealDate,
          );

          setStreamingReply('');
          await handleMealAction(nextAction);
        } catch {
          setMessages((prev) => [
            ...prev,
            {
              role: 'assistant',
              content:
                preferredLanguage === 'vi'
                  ? 'Mình gặp lỗi khi phân tích lại. Bạn thử lại nhé.'
                  : 'Error re-processing request. Please try again.',
            },
          ]);
        }
        return;
      }

      // --- 2. Meal Plan Specific Actions ---
      const mealDate =
        ('mealDate' in action ? action.mealDate : undefined) ?? defaultMealDate;
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
        let targetIndex = action.targetIndex - 1;

        // Try to infer index from name if invalid (critical for LLM swap_food)
        if (
          !Number.isInteger(targetIndex) ||
          targetIndex < 0 ||
          targetIndex >= items.length
        ) {
          const fromName = (action.filters as { fromName?: unknown })?.fromName;
          if (fromName && typeof fromName === 'string') {
            const lowerFrom = fromName.toLowerCase();
            const foundIndex = items.findIndex((item) =>
              item.foodId?.name?.toLowerCase().includes(lowerFrom),
            );
            if (foundIndex !== -1) {
              targetIndex = foundIndex;
            }
          }
        }

        if (
          !Number.isInteger(targetIndex) ||
          targetIndex < 0 ||
          targetIndex >= items.length
        ) {
          setMessages((prev) => [
            ...prev,
            {
              role: 'assistant',
              content: 'Food index is not valid or could not be found.',
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
            mergedFilters,
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
      dispatch,
      fetchDetailedFood,
      fetchExternalFoodFacts,
      fetchSwapOptions,
      findMealPlanDay,
      getMealPlanSingleDay, // Added
      messages,
      pendingSwap,
      preferredLanguage,
      requestMarketplaceAction, // Added
      setMessages, // Added
      upsertPantryItem, // Added
    ],
  );

  const handleSend = useCallback(
    async (overrideInput?: string) => {
      const source = overrideInput ?? input;
      const trimmed = source.trim();
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
      if (!overrideInput) setInput('');
      setIsLoading(true);
      setStreamingReply('');

      try {
        let fullContent = '';
        let finalCommands: unknown[] = [];

        await requestMarketplaceAction(
          trimmed,
          history,
          pendingSwap,
          (event) => {
            if (event.status === 'thinking') {
              setThinkingMessage(event.message);
            } else if (event.status === 'token') {
              setThinkingMessage(null); // Clear thinking when tokens start
              fullContent += event.content;
              setStreamingReply((prev) => prev + event.content);
            } else if (event.status === 'done') {
              finalCommands = event.commands || [];
            }
          },
        );

        // setStreamingReply(''); // Keep it visible until we process actions or finalize
        // If we have commands, we should process them.
        // If just text, it's already in streamingReply.
        // We need to convert this to MealAction to match handleMealAction expectation,
        // OR refactor handleMealAction to take the new structure.
        // Easiest is to reconstruct a MealAction.

        // If commands exist, execute them.
        if (finalCommands.length > 0) {
          // Assuming priority to the first command if multiple for now,
          // or we can handle multiple.
          // Existing logic expects one MealAction.
          // Let's take the first one and treat others? Or sequentially.
          // For now, let's just handle the first one + text message.

          // Actually, if there is text (fullContent), we should add it as a message.
          if (fullContent) {
            setMessages((prev) => [
              ...prev,
              { role: 'assistant', content: fullContent },
            ]);
            setStreamingReply('');
          }

          for (const cmd of finalCommands) {
            let actionToRun = cmd as MealAction;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            if ((cmd as any).type === 'FRONTEND_COMMAND') {
              actionToRun = convertFrontendCommandToMealAction(
                cmd,
              ) as MealAction;
            }
            if (actionToRun) await handleMealAction(actionToRun);
          }
        } else {
          // No explicit commands from stream events.
          // Try to parse the text content as a JSON command (fallback).
          const fallbackAction = parseMealAction(fullContent);

          if (fallbackAction.type !== 'message') {
            await handleMealAction(fallbackAction);
            // Optionally add a small confirmation message if needed,
            // but usually the action itself provides feedback or UI updates.
            // If we want to show the reasoning text if mixed?
            // The parser extracts JSON. If the intent was purely JSON, we don't show text.
          } else {
            // It's just a message (or failed to parse as JSON)
            setMessages((prev) => [
              ...prev,
              { role: 'assistant', content: fullContent },
            ]);
          }
          setStreamingReply('');
        }
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
    },
    [
      applySwapOption,
      handleMealAction,
      input,
      isLoading,
      messages,
      pendingSwap,
      requestMarketplaceAction,
      commitMealPlanUpdate,
      setMessages,
      setPreferredLanguage,
    ],
  );

  // Handle action button clicks from markdown links like #action:type:param1:param2
  const handleActionClick = useCallback(
    async (actionType: string, ...params: string[]) => {
      // swap_with: open swap modal with search query pre-filled
      // Format: #action:swap_with:mealType:FoodName
      if (actionType === 'swap_with') {
        const [mealType, ...foodNameParts] = params;
        const searchQuery = foodNameParts.join(':'); // In case food name has colons
        const mealPlanDay = findMealPlanDay(defaultMealDate);
        if (mealPlanDay && mealType) {
          const items = mealPlanDay.mealItems[mealType as MealType];
          if (items && items.length > 0) {
            const targetItem = items[0];
            // Set swap modal data with search filter
            dispatch(
              openSwapModal({
                swapType: 'food',
                mealPlanId: mealPlanDay._id,
                mealDate: defaultMealDate,
                mealType: mealType as MealType,
                targetItemId: targetItem._id,
                targetFoodId: targetItem.foodId?._id,
                filters: { q: searchQuery },
              }),
            );
            dispatch(setSwapModalFilters({ filters: { q: searchQuery } }));
            setMessages((prev) => [
              ...prev,
              {
                role: 'assistant',
                content:
                  preferredLanguage === 'vi'
                    ? `Đã mở panel swap với tìm kiếm "${searchQuery}". Bạn có thể chọn món thay thế.`
                    : `Opened swap panel with search "${searchQuery}". You can choose a replacement.`,
              },
            ]);
          } else {
            setMessages((prev) => [
              ...prev,
              {
                role: 'assistant',
                content:
                  preferredLanguage === 'vi'
                    ? `Không có món nào trong ${mealType} để swap.`
                    : `No items in ${mealType} to swap.`,
              },
            ]);
          }
        }
        return;
      }

      if (actionType === 'swap_option' && pendingSwap) {
        const optionIndex = parseInt(params[0], 10);
        if (!isNaN(optionIndex)) {
          setMessages((prev) => [
            ...prev,
            { role: 'user', content: `Chọn option ${optionIndex}` },
          ]);
          setIsLoading(true);
          try {
            await applySwapOption(pendingSwap, optionIndex);
          } finally {
            setIsLoading(false);
          }
        }
        return;
      }

      // open_swap: opens swap panel for the entire meal type
      if (actionType === 'open_swap') {
        const mealType = params[0] as MealType;
        const searchQuery = params.slice(1).join(':'); // Join remaining params as search query

        const mealPlanDay = findMealPlanDay(defaultMealDate);
        if (mealPlanDay) {
          const items = mealPlanDay.mealItems[mealType];
          if (items && items.length > 0) {
            // Open swap panel for the entire meal type (not just one item)
            // If searchQuery is provided, set it in filters
            const filters = searchQuery ? { q: searchQuery } : undefined;
            if (filters) {
              dispatch(setSwapModalFilters({ filters }));
            }

            dispatch(
              openSwapModal({
                swapType: 'meal', // 'meal' instead of 'food' to swap entire meal
                mealPlanId: mealPlanDay._id,
                mealDate: defaultMealDate,
                mealType: mealType,
                filters: filters,
              }),
            );
            setMessages((prev) => [
              ...prev,
              {
                role: 'assistant',
                content:
                  preferredLanguage === 'vi'
                    ? `Đã mở panel swap cho bữa ${mealType}${searchQuery ? ` với tìm kiếm "${searchQuery}"` : ''}. Bạn có thể chọn món thay thế.`
                    : `Opened swap panel for ${mealType}${searchQuery ? ` with search "${searchQuery}"` : ''}. You can browse and choose replacements.`,
              },
            ]);
          } else {
            setMessages((prev) => [
              ...prev,
              {
                role: 'assistant',
                content:
                  preferredLanguage === 'vi'
                    ? `Chưa có món nào trong ${mealType} để swap.`
                    : `No items in ${mealType} to swap yet.`,
              },
            ]);
          }
        }
        return;
      }

      // search_food: opens food dock with search query
      if (actionType === 'search_food') {
        const query = params.join(':'); // Rejoin if it was split by colons

        dispatch(setDockSearchQuery(query));
        dispatch(setIsDockExpanded(true));

        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content:
              preferredLanguage === 'vi'
                ? `Đã mở tìm kiếm món ăn: "${query}".`
                : `Opened food search for: "${query}".`,
          },
        ]);
        return;
      }

      // Unknown action
      // console.warn('[Chatbot] Unknown action type:', actionType);
    },
    [
      applySwapOption,
      defaultMealDate,
      dispatch,
      findMealPlanDay,
      pendingSwap,
      preferredLanguage,
      setMessages,
    ],
  );

  useEffect(() => {
    if (embedded) {
      const msg = initialMessage?.trim();
      if (msg && msg !== lastInitialMessageRef.current) {
        lastInitialMessageRef.current = msg;
        handleSend(msg);
      }
      return;
    }

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const pending = (window as unknown as any).npPendingChatMessage as
        | string
        | undefined;
      if (pending) {
        handleOpenChat();
        setTimeout(() => {
          handleSend(pending);
          try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            delete (window as unknown as any).npPendingChatMessage;
          } catch {
            // ignore
          }
        }, 50);
      }
    } catch {
      // ignore
    }
  }, [embedded, handleOpenChat, handleSend, initialMessage]);

  const handleNewChat = useCallback(() => {
    resetChatContext(); // Use context reset
    setInput('');
    setPendingSwap(null);
    setIsLoading(false);
  }, [resetChatContext, setInput, setIsLoading, setPendingSwap]);

  useEffect(() => {
    if (!embedded) return;
    if (resetNonce === null) return;
    if (lastResetNonceRef.current === resetNonce) return;
    lastResetNonceRef.current = resetNonce;
    handleNewChat();
  }, [embedded, handleNewChat, resetNonce]);

  useEffect(() => {
    if (!embedded) return;
    if (sendNonce === null) return;
    if (lastSendNonceRef.current === sendNonce) return;
    lastSendNonceRef.current = sendNonce;
    const msg = externalMessage?.trim();
    if (!msg) return;
    handleSend(msg);
  }, [embedded, externalMessage, handleSend, sendNonce]);

  const handleBack = useCallback(() => {
    onBack?.();
  }, [onBack]);

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
    [assistantAnimation, robotMood],
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

  const isEmbeddedHeaderless = embedded && headerless;

  const chatPanel = (
    <div
      className={
        isEmbeddedHeaderless
          ? 'flex h-full min-h-0 w-full flex-col'
          : 'flex h-[420px] w-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl'
      }
    >
      {!isEmbeddedHeaderless && (
        <div className='flex items-center justify-between border-b border-gray-200 px-4 py-3'>
          <div>
            <div className='text-xs font-semibold tracking-[0.2em] text-gray-500 uppercase'>
              Help center
            </div>
            <div className='mt-1 text-base font-semibold text-gray-900'>
              NutriBot
            </div>
          </div>
          <div className='flex items-center gap-2'>
            <button
              className='rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-semibold text-gray-600 hover:bg-gray-50'
              onClick={handleNewChat}
              type='button'
            >
              {preferredLanguage === 'vi' ? 'Chat mới' : 'New chat'}
            </button>
            {embedded ? (
              <button
                className='rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-semibold text-gray-600 hover:bg-gray-50'
                onClick={handleBack}
                type='button'
              >
                {preferredLanguage === 'vi' ? 'Quay lại Help' : 'Back to Help'}
              </button>
            ) : (
              <button
                className='rounded-full p-2 text-gray-600 hover:bg-gray-100'
                onClick={handleToggleChat}
                aria-label='Close chatbot'
                type='button'
              >
                <FaTimes />
              </button>
            )}
          </div>
        </div>
      )}

      <div className='min-h-0 flex-1 space-y-3 overflow-y-auto px-4 py-3 text-sm'>
        {messages.map((message, index) => (
          <div
            key={`${message.role}-${index}`}
            className={`flex ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-3 py-2 leading-relaxed ${
                message.role === 'user'
                  ? 'bg-primary whitespace-pre-line text-black'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              {message.role === 'assistant' ? (
                <div className='prose prose-sm max-w-none text-gray-700'>
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      p: ({ children }) => (
                        <p className='my-1 leading-relaxed'>{children}</p>
                      ),
                      ul: ({ children }) => (
                        <ul className='my-1 list-disc space-y-1 pl-5'>
                          {children}
                        </ul>
                      ),
                      ol: ({ children }) => (
                        <ol className='my-1 list-decimal space-y-1 pl-5'>
                          {children}
                        </ol>
                      ),
                      a: ({ children, href }) => {
                        // Handle action buttons: #action:type:param1:param2:...
                        if (href?.startsWith('#action:')) {
                          const decodedHref = decodeURIComponent(href);
                          const parts = decodedHref.substring(8).split(':'); // Remove '#action:' and split
                          const [actionType, ...params] = parts;
                          return (
                            <button
                              onClick={() =>
                                handleActionClick(actionType, ...params)
                              }
                              className='bg-primary my-1 mr-2 inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-medium text-black shadow-sm transition-all hover:bg-emerald-400 hover:shadow-md active:scale-95'
                            >
                              {children}
                            </button>
                          );
                        }
                        // Handle internal navigation links: /page-path
                        if (href?.startsWith('/')) {
                          return (
                            <button
                              onClick={() => navigate({ to: href })}
                              className='font-semibold text-emerald-700 underline underline-offset-4 hover:text-emerald-800'
                            >
                              {children}
                            </button>
                          );
                        }
                        // External links
                        return (
                          <a
                            href={href}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='font-semibold text-emerald-700 underline-offset-4 hover:underline'
                          >
                            {children}
                          </a>
                        );
                      },
                      h1: ({ children }) => (
                        <h3 className='my-2 text-sm font-semibold'>
                          {children}
                        </h3>
                      ),
                      h2: ({ children }) => (
                        <h4 className='my-2 text-sm font-semibold'>
                          {children}
                        </h4>
                      ),
                      h3: ({ children }) => (
                        <h5 className='my-2 text-sm font-semibold'>
                          {children}
                        </h5>
                      ),
                      code: ({ children }) => (
                        <code className='rounded bg-gray-200 px-1 py-0.5 text-xs'>
                          {children}
                        </code>
                      ),
                    }}
                  >
                    {(() => {
                      // Normalize content to prevent broken links due to newlines and spaces
                      // 1. Fix broken links: [Text] \n (#action) -> [Text](#action)
                      // 2. Encode spaces in action URLs: (#action:foo bar) -> (#action:foo%20bar)
                      // 3. Hide JSON commands: {"type": "..."}
                      const normalizedContent = message.content
                        .replace(/\]\s+\(#action/g, '](#action')
                        .replace(/\(#action:[^)]+\)/g, (match) =>
                          match.replace(/ /g, '%20'),
                        )
                        .replace(/\{"type":"[^"]+".*?\}/g, '');
                      return normalizedContent;
                    })()}
                  </ReactMarkdown>
                </div>
              ) : (
                message.content
              )}
            </div>
          </div>
        ))}

        {streamingReply && (
          <div className='flex justify-start'>
            <div className='max-w-[85%] rounded-2xl bg-gray-100 px-3 py-2 leading-relaxed'>
              <div className='prose prose-sm max-w-none'>
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    p: ({ children }) => (
                      <p className='my-1 leading-relaxed'>{children}</p>
                    ),
                    ul: ({ children }) => (
                      <ul className='my-1 list-disc space-y-1 pl-5'>
                        {children}
                      </ul>
                    ),
                    ol: ({ children }) => (
                      <ol className='my-1 list-decimal space-y-1 pl-5'>
                        {children}
                      </ol>
                    ),
                    a: ({ children, href }) => {
                      // Handle action buttons: #action:type:param1:param2:...
                      if (href?.startsWith('#action:')) {
                        const decodedHref = decodeURIComponent(href);
                        const parts = decodedHref.substring(8).split(':'); // Remove '#action:' and split
                        const [actionType, ...params] = parts;
                        return (
                          <button
                            onClick={() =>
                              handleActionClick(actionType, ...params)
                            }
                            className='bg-primary my-1 mr-2 inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-medium text-black shadow-sm transition-all hover:bg-emerald-400 hover:shadow-md active:scale-95'
                          >
                            {children}
                          </button>
                        );
                      }
                      // Handle internal navigation links: /page-path
                      if (href?.startsWith('/')) {
                        return (
                          <button
                            onClick={() => navigate({ to: href })}
                            className='font-semibold text-emerald-700 underline underline-offset-4 hover:text-emerald-800'
                          >
                            {children}
                          </button>
                        );
                      }
                      // External links
                      return (
                        <a
                          href={href}
                          target='_blank'
                          rel='noopener noreferrer'
                          className='font-semibold text-emerald-700 underline-offset-4 hover:underline'
                        >
                          {children}
                        </a>
                      );
                    },
                    h1: ({ children }) => (
                      <h3 className='my-2 text-sm font-semibold'>{children}</h3>
                    ),
                    h2: ({ children }) => (
                      <h4 className='my-2 text-sm font-semibold'>{children}</h4>
                    ),
                    h3: ({ children }) => (
                      <h5 className='my-2 text-sm font-semibold'>{children}</h5>
                    ),
                    code: ({ children }) => (
                      <code className='rounded bg-gray-200 px-1 py-0.5 text-xs'>
                        {children}
                      </code>
                    ),
                  }}
                >
                  {(() => {
                    const normalizedContent = streamingReply
                      .replace(/\]\s+\(#action/g, '](#action')
                      .replace(/\(#action:[^)]+\)/g, (match) =>
                        match.replace(/ /g, '%20'),
                      )
                      .replace(/\{"type":"[^"]+".*?\}/g, '');
                    return normalizedContent;
                  })()}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        )}

        {thinkingMessage && (
          <div className='mb-2 flex justify-start px-4'>
            <style>{shimmerStyles}</style>
            <div className='flex items-center gap-2 text-xs'>
              <FaSpinner className='animate-spin text-emerald-500' />
              <span className='shimmer-text font-medium'>
                {thinkingMessage}
              </span>
            </div>
          </div>
        )}

        {isLoading && !streamingReply && !thinkingMessage && (
          <div className='text-xs text-gray-500'>
            {preferredLanguage === 'vi' ? 'Đang xử lý...' : 'Processing...'}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {!hideComposer && (
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
              onClick={() => handleSend()}
              type='button'
              aria-label='Send'
              disabled={!input.trim() || isLoading}
            >
              <FaPaperPlane />
            </button>
          </div>
        </div>
      )}
    </div>
  );

  if (embedded) {
    return <div className='h-full min-h-0 w-full'>{chatPanel}</div>;
  }

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
          className='w-[360px] max-w-[90vw]'
        >
          {chatPanel}
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
              key={assistantAnimation}
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
