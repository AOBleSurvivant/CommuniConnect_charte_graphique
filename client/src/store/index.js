import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import postsReducer from './slices/postsSlice';
import alertsReducer from './slices/alertsSlice';
import eventsReducer from './slices/eventsSlice';
import messagesReducer from './slices/messagesSlice';
import friendsReducer from './slices/friendsSlice';
import livestreamsReducer from './slices/livestreamsSlice';
import notificationsReducer from './slices/notificationsSlice';
import moderationReducer from './slices/moderationSlice';
import mapReducer from './slices/mapSlice';
import communiconseilReducer from './slices/communiconseilSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    posts: postsReducer,
    alerts: alertsReducer,
    events: eventsReducer,
    messages: messagesReducer,
    friends: friendsReducer,
    livestreams: livestreamsReducer,
    notifications: notificationsReducer,
    moderation: moderationReducer,
    map: mapReducer,
    communiconseil: communiconseilReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export default store; 