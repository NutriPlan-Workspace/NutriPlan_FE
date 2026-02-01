import React, { createContext, ReactNode, useContext, useState } from 'react';

export type ChatMessage = { role: 'user' | 'assistant'; content: string };
export type Language = 'vi' | 'en';

interface ChatContextType {
  messages: ChatMessage[];
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  preferredLanguage: Language;
  setPreferredLanguage: React.Dispatch<React.SetStateAction<Language>>;
  handleNewChat: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

function getInitialLanguage(): Language {
  if (typeof navigator !== 'undefined' && navigator.language) {
    return navigator.language.startsWith('vi') ? 'vi' : 'en';
  }
  return 'vi';
}

function createInitialMessages(lang: Language): ChatMessage[] {
  const content =
    lang === 'vi'
      ? 'Xin chào! Mình là trợ lý dinh dưỡng của bạn. Bạn muốn lên thực đơn, tìm công thức hay cần lời khuyên gì không?'
      : 'Hello! I am your nutrition assistant. Would you like to plan meals, find recipes, or get some advice?';
  return [{ role: 'assistant', content }];
}

export const ChatProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [preferredLanguage, setPreferredLanguage] = useState<Language>(() =>
    getInitialLanguage(),
  );

  // Initialize messages normally (empty or default).
  // We do NOT use sessionStorage here because user wants clear on F5.
  // We initialize with default welcome message.
  const [messages, setMessages] = useState<ChatMessage[]>(() =>
    createInitialMessages(getInitialLanguage()),
  );

  const handleNewChat = () => {
    setMessages(createInitialMessages(preferredLanguage));
  };

  return (
    <ChatContext.Provider
      value={{
        messages,
        setMessages,
        preferredLanguage,
        setPreferredLanguage,
        handleNewChat,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChatContext must be used within a ChatProvider');
  }
  return context;
};
