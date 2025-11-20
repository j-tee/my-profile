import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { 
  Experience, 
  CreateExperienceDTO, 
  UpdateExperienceDTO, 
  PaginatedResponse,
  ApiError 
} from '../../types';
import { experienceService } from '../../services';

export interface ExperienceState {
  experiences: Experience[];
  currentExperience: Experience | null;
  pagination: {
    count: number;
    next: string | null;
    previous: string | null;
    page: number;
    pageSize: number;
    totalPages: number;
  } | null;
  loading: boolean;
  error: ApiError | null;
  actionLoading: boolean;
}

const initialState: ExperienceState = {
  experiences: [],
  currentExperience: null,
  pagination: null,
  loading: false,
  error: null,
  actionLoading: false,
};

// Async thunks
export const fetchExperiences = createAsyncThunk<
  PaginatedResponse<Experience>,
  { profileId: string; page?: number },
  { rejectValue: ApiError }
>('experience/fetchExperiences', async ({ profileId, page = 1 }, { rejectWithValue }) => {
  try {
    return await experienceService.getExperiences(profileId, { page });
  } catch (error) {
    return rejectWithValue(error as ApiError);
  }
});

export const fetchExperienceById = createAsyncThunk<
  Experience,
  string,
  { rejectValue: ApiError }
>('experience/fetchExperienceById', async (id, { rejectWithValue }) => {
  try {
    return await experienceService.getExperienceById(id);
  } catch (error) {
    return rejectWithValue(error as ApiError);
  }
});

export const createExperience = createAsyncThunk<
  Experience,
  CreateExperienceDTO,
  { rejectValue: ApiError }
>('experience/createExperience', async (data, { rejectWithValue }) => {
  try {
    return await experienceService.createExperience(data);
  } catch (error) {
    return rejectWithValue(error as ApiError);
  }
});

export const updateExperience = createAsyncThunk<
  Experience,
  { id: string; data: UpdateExperienceDTO },
  { rejectValue: ApiError }
>('experience/updateExperience', async ({ id, data }, { rejectWithValue }) => {
  try {
    return await experienceService.updateExperience(id, data);
  } catch (error) {
    return rejectWithValue(error as ApiError);
  }
});

export const deleteExperience = createAsyncThunk<string, string, { rejectValue: ApiError }>(
  'experience/deleteExperience',
  async (id, { rejectWithValue }) => {
    try {
      await experienceService.deleteExperience(id);
      return id;
    } catch (error) {
      return rejectWithValue(error as ApiError);
    }
  }
);

// Slice
const experienceSlice = createSlice({
  name: 'experience',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentExperience: (state) => {
      state.currentExperience = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch experiences
      .addCase(fetchExperiences.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchExperiences.fulfilled,
        (state, action: PayloadAction<PaginatedResponse<Experience>>) => {
          state.loading = false;
          state.experiences = action.payload.results;
          state.pagination = {
            count: action.payload.count,
            next: action.payload.next || null,
            previous: action.payload.previous || null,
            page: action.payload.page,
            pageSize: action.payload.pageSize,
            totalPages: action.payload.totalPages,
          };
        }
      )
      .addCase(fetchExperiences.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || null;
      })

      // Fetch experience by ID
      .addCase(fetchExperienceById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchExperienceById.fulfilled, (state, action: PayloadAction<Experience>) => {
        state.loading = false;
        state.currentExperience = action.payload;
      })
      .addCase(fetchExperienceById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || null;
      })

      // Create experience
      .addCase(createExperience.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(createExperience.fulfilled, (state, action: PayloadAction<Experience>) => {
        state.actionLoading = false;
        state.experiences.unshift(action.payload);
      })
      .addCase(createExperience.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload || null;
      })

      // Update experience
      .addCase(updateExperience.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(updateExperience.fulfilled, (state, action: PayloadAction<Experience>) => {
        state.actionLoading = false;
        const index = state.experiences.findIndex((exp) => exp.id === action.payload.id);
        if (index !== -1) {
          state.experiences[index] = action.payload;
        }
        if (state.currentExperience?.id === action.payload.id) {
          state.currentExperience = action.payload;
        }
      })
      .addCase(updateExperience.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload || null;
      })

      // Delete experience
      .addCase(deleteExperience.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(deleteExperience.fulfilled, (state, action: PayloadAction<string>) => {
        state.actionLoading = false;
        state.experiences = state.experiences.filter((exp) => exp.id !== action.payload);
      })
      .addCase(deleteExperience.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload || null;
      });
  },
});

export const { clearError, clearCurrentExperience } = experienceSlice.actions;
export default experienceSlice.reducer;
