import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// IndexedDB operations (keeping the same logic from Zustand store)
const DB_NAME = 'ConversationsDB';
const DB_VERSION = 1;
const STORE_NAME = 'conversations';

class ConversationStore {
  constructor() {
    this.db = null;
    this.initDB();
  }

  async initDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve(this.db);
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        }
      };
    });
  }

  async saveConversation(id, data) {
    await this.initDB();
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.put({
        id,
        name: data.name,
        chatHistory: data.chatHistory,
        domData: data.domData,
        timestamp: Date.now()
      });

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async getConversation(id) {
    await this.initDB();
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(id);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async getAllConversations() {
    await this.initDB();
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async deleteConversation(id) {
    await this.initDB();
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.delete(id);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }
}

const conversationStore = new ConversationStore();

// Async thunks for IndexedDB operations
export const saveConversation = createAsyncThunk(
  'conversation/saveConversation',
  async ({ id, data }) => {
    await conversationStore.saveConversation(id, data);
    return { id, data };
  }
);

export const loadConversation = createAsyncThunk(
  'conversation/loadConversation',
  async (id) => {
    const conversation = await conversationStore.getConversation(id);
    return conversation;
  }
);

export const loadAllConversations = createAsyncThunk(
  'conversation/loadAllConversations',
  async () => {
    const conversations = await conversationStore.getAllConversations();
    return conversations.sort((a, b) => b.timestamp - a.timestamp);
  }
);

export const deleteConversation = createAsyncThunk(
  'conversation/deleteConversation',
  async (id) => {
    await conversationStore.deleteConversation(id);
    return id;
  }
);

const conversationSlice = createSlice({
  name: 'conversation',
  initialState: {
    chatHistory: [],
    conversations: [],
    isLoading: false,
    error: null,
  },
  reducers: {
    setChatHistory: (state, action) => {
      state.chatHistory = action.payload;
    },
    addMessage: (state, action) => {
      const { content, role } = action.payload;
      const newMessage = {
        id: Date.now(),
        content,
        role,
        timestamp: new Date().toISOString()
      };
      state.chatHistory.push(newMessage);
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Save conversation
      .addCase(saveConversation.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(saveConversation.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(saveConversation.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      // Load conversation
      .addCase(loadConversation.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loadConversation.fulfilled, (state, action) => {
        state.isLoading = false;
      })
      .addCase(loadConversation.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      // Load all conversations
      .addCase(loadAllConversations.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loadAllConversations.fulfilled, (state, action) => {
        state.isLoading = false;
        state.conversations = action.payload;
      })
      .addCase(loadAllConversations.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      // Delete conversation
      .addCase(deleteConversation.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteConversation.fulfilled, (state, action) => {
        state.isLoading = false;
        state.conversations = state.conversations.filter(
          conv => conv.id !== action.payload
        );
      })
      .addCase(deleteConversation.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });
  },
});

export const { setChatHistory, addMessage, clearError } = conversationSlice.actions;
export default conversationSlice.reducer;
