import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// Actions asynchrones
export const fetchFriends = createAsyncThunk(
  'friends/fetchFriends',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/api/friends');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors de la récupération des amis');
    }
  }
);

export const fetchFriendRequests = createAsyncThunk(
  'friends/fetchFriendRequests',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/api/friends/requests');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors de la récupération des demandes');
    }
  }
);

export const sendFriendRequest = createAsyncThunk(
  'friends/sendFriendRequest',
  async (email, { rejectWithValue }) => {
    try {
      const response = await api.post('/api/friends/request', { recipientId: email });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors de l\'envoi de la demande');
    }
  }
);

export const acceptFriendRequest = createAsyncThunk(
  'friends/acceptFriendRequest',
  async (friendshipId, { rejectWithValue }) => {
    try {
      const response = await api.post(`/api/friends/accept/${friendshipId}`);
      return { friendshipId, ...response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors de l\'acceptation');
    }
  }
);

export const rejectFriendRequest = createAsyncThunk(
  'friends/rejectFriendRequest',
  async (friendshipId, { rejectWithValue }) => {
    try {
      const response = await api.post(`/api/friends/reject/${friendshipId}`);
      return { friendshipId, ...response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors du rejet');
    }
  }
);

export const removeFriend = createAsyncThunk(
  'friends/removeFriend',
  async (friendshipId, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/api/friends/remove/${friendshipId}`);
      return { friendshipId, ...response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors de la suppression');
    }
  }
);

const initialState = {
  friends: [],
  friendRequests: [],
  loading: false,
  error: null,
  success: null
};

const friendsSlice = createSlice({
  name: 'friends',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = null;
    },
    addFriend: (state, action) => {
      state.friends.push(action.payload);
    },
    removeFriendFromList: (state, action) => {
      state.friends = state.friends.filter(friend => friend.friendshipId !== action.payload);
    },
    removeRequestFromList: (state, action) => {
      state.friendRequests = state.friendRequests.filter(request => request._id !== action.payload);
    }
  },
  extraReducers: (builder) => {
    builder
      // fetchFriends
      .addCase(fetchFriends.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFriends.fulfilled, (state, action) => {
        state.loading = false;
        // Extraire les données du format {success: true, friends: [...]}
        state.friends = action.payload.friends || action.payload.data || action.payload || [];
      })
      .addCase(fetchFriends.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // fetchFriendRequests
      .addCase(fetchFriendRequests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFriendRequests.fulfilled, (state, action) => {
        state.loading = false;
        // Extraire les données du format {success: true, requests: [...]}
        state.friendRequests = action.payload.requests || action.payload.data || action.payload || [];
      })
      .addCase(fetchFriendRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // sendFriendRequest
      .addCase(sendFriendRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendFriendRequest.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.message;
      })
      .addCase(sendFriendRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // acceptFriendRequest
      .addCase(acceptFriendRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(acceptFriendRequest.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.message;
        // Retirer la demande de la liste
        state.friendRequests = state.friendRequests.filter(request => request._id !== action.payload.friendshipId);
      })
      .addCase(acceptFriendRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // rejectFriendRequest
      .addCase(rejectFriendRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(rejectFriendRequest.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.message;
        // Retirer la demande de la liste
        state.friendRequests = state.friendRequests.filter(request => request._id !== action.payload.friendshipId);
      })
      .addCase(rejectFriendRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // removeFriend
      .addCase(removeFriend.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFriend.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.message;
        // Retirer l'ami de la liste
        state.friends = state.friends.filter(friend => friend.friendshipId !== action.payload.friendshipId);
      })
      .addCase(removeFriend.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearError, clearSuccess, addFriend, removeFriendFromList, removeRequestFromList } = friendsSlice.actions;

// Sélecteurs
export const selectFriends = (state) => state.friends.friends;
export const selectFriendRequests = (state) => state.friends.friendRequests;
export const selectFriendsLoading = (state) => state.friends.loading;
export const selectFriendsError = (state) => state.friends.error;
export const selectFriendsSuccess = (state) => state.friends.success;

export default friendsSlice.reducer; 