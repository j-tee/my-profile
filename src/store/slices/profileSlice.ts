import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { Profile, CreateProfileDTO, UpdateProfileDTO, ApiError } from '../../types';
import { profileService } from '../../services';

export interface ProfileState {
  profile: Profile | null;
  loading: boolean;
  error: ApiError | null;
  uploadingPicture: boolean;
  uploadingCover: boolean;
}

const initialState: ProfileState = {
  profile: null,
  loading: false,
  error: null,
  uploadingPicture: false,
  uploadingCover: false,
};

// Async thunks
export const fetchProfile = createAsyncThunk<Profile, void, { rejectValue: ApiError }>(
  'profile/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      return await profileService.getProfile();
    } catch (error) {
      return rejectWithValue(error as ApiError);
    }
  }
);

export const fetchProfileById = createAsyncThunk<Profile, string, { rejectValue: ApiError }>(
  'profile/fetchProfileById',
  async (id, { rejectWithValue }) => {
    try {
      return await profileService.getProfileById(id);
    } catch (error) {
      return rejectWithValue(error as ApiError);
    }
  }
);

export const createProfile = createAsyncThunk<
  Profile,
  CreateProfileDTO,
  { rejectValue: ApiError }
>('profile/createProfile', async (data, { rejectWithValue }) => {
  try {
    return await profileService.createProfile(data);
  } catch (error) {
    return rejectWithValue(error as ApiError);
  }
});

export const updateProfile = createAsyncThunk<
  Profile,
  { id: string; data: UpdateProfileDTO },
  { rejectValue: ApiError }
>('profile/updateProfile', async ({ id, data }, { rejectWithValue }) => {
  try {
    return await profileService.updateProfile(id, data);
  } catch (error) {
    return rejectWithValue(error as ApiError);
  }
});

export const uploadProfilePicture = createAsyncThunk<
  Profile,
  { id: string; file: File },
  { rejectValue: ApiError }
>('profile/uploadProfilePicture', async ({ id, file }, { rejectWithValue }) => {
  try {
    return await profileService.uploadProfilePicture(id, file);
  } catch (error) {
    return rejectWithValue(error as ApiError);
  }
});

export const uploadCoverImage = createAsyncThunk<
  Profile,
  { id: string; file: File },
  { rejectValue: ApiError }
>('profile/uploadCoverImage', async ({ id, file }, { rejectWithValue }) => {
  try {
    return await profileService.uploadCoverImage(id, file);
  } catch (error) {
    return rejectWithValue(error as ApiError);
  }
});

// Slice
const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearProfile: (state) => {
      state.profile = null;
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch profile
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action: PayloadAction<Profile>) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || null;
      })

      // Fetch profile by ID
      .addCase(fetchProfileById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfileById.fulfilled, (state, action: PayloadAction<Profile>) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(fetchProfileById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || null;
      })

      // Create profile
      .addCase(createProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProfile.fulfilled, (state, action: PayloadAction<Profile>) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(createProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || null;
      })

      // Update profile
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action: PayloadAction<Profile>) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || null;
      })

      // Upload profile picture
      .addCase(uploadProfilePicture.pending, (state) => {
        state.uploadingPicture = true;
        state.error = null;
      })
      .addCase(uploadProfilePicture.fulfilled, (state, action: PayloadAction<Profile>) => {
        state.uploadingPicture = false;
        state.profile = action.payload;
      })
      .addCase(uploadProfilePicture.rejected, (state, action) => {
        state.uploadingPicture = false;
        state.error = action.payload || null;
      })

      // Upload cover image
      .addCase(uploadCoverImage.pending, (state) => {
        state.uploadingCover = true;
        state.error = null;
      })
      .addCase(uploadCoverImage.fulfilled, (state, action: PayloadAction<Profile>) => {
        state.uploadingCover = false;
        state.profile = action.payload;
      })
      .addCase(uploadCoverImage.rejected, (state, action) => {
        state.uploadingCover = false;
        state.error = action.payload || null;
      });
  },
});

export const { clearError, clearProfile } = profileSlice.actions;
export default profileSlice.reducer;
