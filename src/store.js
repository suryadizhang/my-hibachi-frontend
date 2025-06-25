import { configureStore, createSlice } from '@reduxjs/toolkit';

const chatbotSlice = createSlice({
  name: 'chatbot',
  initialState: {
    memory: {
      lastIntent: null,
      lastTopic: null,
      history: [],
      bookingDetails: {},
      dietaryPreferences: {},
    },
  },
  reducers: {
    setMemory: (state, action) => {
      state.memory = { ...state.memory, ...action.payload };
    },
    addHistory: (state, action) => {
      state.memory.history.push(action.payload);
    },
    clearMemory: (state) => {
      state.memory = {
        lastIntent: null,
        lastTopic: null,
        history: [],
        bookingDetails: {},
        dietaryPreferences: {},
      };
    },
  },
});

export const { setMemory, addHistory, clearMemory } = chatbotSlice.actions;

const store = configureStore({
  reducer: {
    chatbot: chatbotSlice.reducer,
  },
});

export default store;