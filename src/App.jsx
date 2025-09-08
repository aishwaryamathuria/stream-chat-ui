import { useState, useEffect, useRef } from 'react'
import './App.css'
import Sidebar from './components/Sidebar'
import ChatWindow from './components/ChatWindow'
import InputArea from './components/InputArea'
import CardSection from './components/CardSection'
import { useConversation } from './hooks/redux.js'

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [conversationStarted, setConversationStarted] = useState(false);
  const [currentThreadId, setCurrentThreadId] = useState(null);
  const [currentThreadName, setCurrentThreadName] = useState(null);
  const [showCards, setShowCards] = useState(true);
  const [showWelcome, setShowWelcome] = useState(true);
  
  const { 
    chatHistory, 
    addMessage, 
    setChatHistory,
    saveConversation,
    loadConversation,
    deleteConversation,
    loadAllConversations,
    conversations
  } = useConversation();

  const chatWindowRef = useRef(null);

  useEffect(() => {
    // Load all conversations on app start
    loadAllConversations();
  }, [loadAllConversations]);

  const handleSendMessage = async (message) => {
    if (!message.trim()) return;

    // Start conversation if not already started
    if (!conversationStarted) {
      setConversationStarted(true);
      setShowCards(false);
      setShowWelcome(false);
      const threadId = generateId();
      setCurrentThreadId(threadId);
      setCurrentThreadName(message.slice(0, 20) + '...');
    }

    // Add user message
    addMessage(message, 'user');

    // Simulate bot response (you can replace this with actual API call)
    setTimeout(() => {
      const botResponse = `I received your message: "${message}". This is a simulated response.`;
      addMessage(botResponse, 'bot');
    }, 1000);
  };

  const handleHomeClick = () => {
    setConversationStarted(false);
    setShowCards(true);
    setShowWelcome(true);
    setChatHistory([]);
    setCurrentThreadId(null);
    setCurrentThreadName(null);
  };

  const handleConversationLoad = async (conversationId) => {
    const conversation = await loadConversation(conversationId);
    if (conversation) {
      setChatHistory(JSON.parse(conversation.chatHistory));
      setCurrentThreadId(conversationId);
      setCurrentThreadName(conversation.name);
      setConversationStarted(true);
      setShowCards(false);
      setShowWelcome(false);
      setSidebarOpen(false);
    }
  };

  const handleConversationDelete = async (conversationId) => {
    await deleteConversation(conversationId);
    if (currentThreadId === conversationId) {
      handleHomeClick();
    }
  };

  const generateId = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let id = '';
    for (let i = 0; i < 8; i++) {
      id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
  };

  return (
    <div className="App">
      <Sidebar 
        isOpen={sidebarOpen}
        conversations={conversations}
        onLoadConversation={handleConversationLoad}
        onDeleteConversation={handleConversationDelete}
      />
      
      <button 
        className="toggle-btn"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path
            d="M15.75 18H4.25C3.00928 18 2 16.9902 2 15.75V4.25C2 3.00977 3.00928 2 4.25 2H15.75C16.9907 2 18 3.00977 18 4.25V15.75C18 16.9902 16.9907 18 15.75 18ZM4.25 3.5C3.83643 3.5 3.5 3.83691 3.5 4.25V15.75C3.5 16.1631 3.83643 16.5 4.25 16.5H15.75C16.1636 16.5 16.5 16.1631 16.5 15.75V4.25C16.5 3.83691 16.1636 3.5 15.75 3.5H4.25Z"
            fill="#292929" />
          <path
            d="M8.75 15H7C5.89697 15 5 14.1025 5 13V7C5 5.89746 5.89697 5 7 5H8.75C9.85303 5 10.75 5.89746 10.75 7V13C10.75 14.1025 9.85303 15 8.75 15ZM7 6.5C6.72412 6.5 6.5 6.72461 6.5 7V13C6.5 13.2754 6.72412 13.5 7 13.5H8.75C9.02588 13.5 9.25 13.2754 9.25 13V7C9.25 6.72461 9.02588 6.5 8.75 6.5H7Z"
            fill="#292929" />
          <path opacity="0.12"
            d="M8.75 5.75H7C6.30964 5.75 5.75 6.30964 5.75 7V13C5.75 13.6904 6.30964 14.25 7 14.25H8.75C9.44036 14.25 10 13.6904 10 13V7C10 6.30964 9.44036 5.75 8.75 5.75Z"
            fill="#292929" />
        </svg>
      </button>

      {conversationStarted && (
        <button 
          className="toggle-btn home"
          onClick={handleHomeClick}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="18" viewBox="0 0 22 18" fill="none">
            <path fillRule="evenodd" clipRule="evenodd" d="M13.314 4H8.05001V1.9955C8.05 1.92757 8.03024 1.86111 7.99311 1.80423C7.95599 1.74734 7.90311 1.70249 7.84094 1.67514C7.77876 1.64778 7.70997 1.63912 7.64295 1.65019C7.57593 1.66126 7.51358 1.6916 7.46351 1.7375L3.85001 5.05L7.46351 8.3625C7.51358 8.4084 7.57593 8.43874 7.64295 8.44981C7.70997 8.46089 7.77876 8.45222 7.84094 8.42487C7.90311 8.39751 7.95599 8.35266 7.99311 8.29577C8.03024 8.23889 8.05 8.17243 8.05001 8.1045V6H13.35C14.2707 5.98133 15.1641 6.31292 15.8496 6.92774C16.5352 7.54256 16.9617 8.39474 17.043 9.312C17.0685 9.78661 16.9971 10.2614 16.8331 10.7076C16.6692 11.1537 16.416 11.5617 16.0892 11.9068C15.7624 12.2519 15.3687 12.5268 14.9321 12.7147C14.4956 12.9027 14.0253 12.9997 13.55 13H6.55001C6.4174 13 6.29022 13.0527 6.19645 13.1464C6.10268 13.2402 6.05001 13.3674 6.05001 13.5V14.5C6.05001 14.6326 6.10268 14.7598 6.19645 14.8536C6.29022 14.9473 6.4174 15 6.55001 15H13.55C14.3179 15.0002 15.0774 14.8396 15.7795 14.5285C16.4816 14.2175 17.1108 13.7628 17.6266 13.1938C18.1423 12.6248 18.5332 11.9542 18.7741 11.225C19.0149 10.4958 19.1004 9.72423 19.025 8.96C18.7515 6.1 16.1865 4 13.314 4Z" fill="#222222"/>
          </svg>
        </button>
      )}

      <div className={`chat-wrapper ${conversationStarted ? 'conversation-mode' : ''}`}>
        <div className="chat-background"></div>
        
        {showWelcome && (
          <h2 className="section-heading">
            Welcome to&nbsp;<span className="cursive">STREAM.</span>&nbsp;What can I help with?
          </h2>
        )}

        <ChatWindow 
          ref={chatWindowRef}
          messages={chatHistory}
          conversationStarted={conversationStarted}
        />

        <InputArea 
          onSendMessage={handleSendMessage}
          conversationStarted={conversationStarted}
        />

        {showCards && (
          <CardSection onCardClick={handleSendMessage} />
        )}
      </div>
    </div>
  )
}

export default App
