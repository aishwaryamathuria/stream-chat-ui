import { useDispatch, useSelector } from 'react-redux';
import { 
  setChatHistory, 
  addMessage, 
  clearError,
  saveConversation,
  loadConversation,
  loadAllConversations,
  deleteConversation
} from '../store/conversationSlice';

// Custom hook for conversation state and actions
export const useConversation = () => {
  const dispatch = useDispatch();
  const { chatHistory, conversations, isLoading, error } = useSelector(
    (state) => state.conversation
  );

  return {
    // State
    chatHistory,
    conversations,
    isLoading,
    error,
    
    // Actions
    setChatHistory: (history) => dispatch(setChatHistory(history)),
    addMessage: (content, role) => dispatch(addMessage({ content, role })),
    clearError: () => dispatch(clearError()),
    saveConversation: (id, data) => dispatch(saveConversation({ id, data })),
    loadConversation: (id) => dispatch(loadConversation(id)),
    loadAllConversations: () => dispatch(loadAllConversations()),
    deleteConversation: (id) => dispatch(deleteConversation(id)),
  };
};
