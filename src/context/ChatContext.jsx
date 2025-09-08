import { createContext, useContext } from 'react';

const ChatContext = createContext();

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChatContext must be used within a ChatProvider');
  }
  return context;
};

export const ChatProvider = ({ children }) => {
  // Placeholder for chat context logic
  const value = {
    messages: [],
    conversations: [],
    currentConversation: null,
    sendMessage: () => {},
    createConversation: () => {}
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};
