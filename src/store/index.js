import { configureStore } from '@reduxjs/toolkit';
import conversationReducer from './conversationSlice';

export const store = configureStore({
  reducer: {
    conversation: conversationReducer,
  },
});

// For TypeScript users (commented out for JavaScript)
// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;
