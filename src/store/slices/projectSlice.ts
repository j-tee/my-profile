import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { 
  Project, 
  CreateProjectDTO, 
  UpdateProjectDTO, 
  PaginatedResponse,
  ApiError 
} from '../../types';
import { projectService } from '../../services';

export interface ProjectState {
  projects: Project[];
  featuredProjects: Project[];
  currentProject: Project | null;
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

const initialState: ProjectState = {
  projects: [],
  featuredProjects: [],
  currentProject: null,
  pagination: null,
  loading: false,
  error: null,
  actionLoading: false,
};

// Async thunks
export const fetchProjects = createAsyncThunk<
  PaginatedResponse<Project>,
  { profileId: string; page?: number },
  { rejectValue: ApiError }
>('project/fetchProjects', async ({ profileId, page = 1 }, { rejectWithValue }) => {
  try {
    return await projectService.getProjects(profileId, { page });
  } catch (error) {
    return rejectWithValue(error as ApiError);
  }
});

export const fetchFeaturedProjects = createAsyncThunk<
  Project[],
  string,
  { rejectValue: ApiError }
>('project/fetchFeaturedProjects', async (profileId, { rejectWithValue }) => {
  try {
    return await projectService.getFeaturedProjects(profileId);
  } catch (error) {
    return rejectWithValue(error as ApiError);
  }
});

export const fetchProjectById = createAsyncThunk<Project, string, { rejectValue: ApiError }>(
  'project/fetchProjectById',
  async (id, { rejectWithValue }) => {
    try {
      return await projectService.getProjectById(id);
    } catch (error) {
      return rejectWithValue(error as ApiError);
    }
  }
);

export const createProject = createAsyncThunk<
  Project,
  CreateProjectDTO,
  { rejectValue: ApiError }
>('project/createProject', async (data, { rejectWithValue }) => {
  try {
    return await projectService.createProject(data);
  } catch (error) {
    return rejectWithValue(error as ApiError);
  }
});

export const updateProject = createAsyncThunk<
  Project,
  { id: string; data: UpdateProjectDTO },
  { rejectValue: ApiError }
>('project/updateProject', async ({ id, data }, { rejectWithValue }) => {
  try {
    return await projectService.updateProject(id, data);
  } catch (error) {
    return rejectWithValue(error as ApiError);
  }
});

export const deleteProject = createAsyncThunk<string, string, { rejectValue: ApiError }>(
  'project/deleteProject',
  async (id, { rejectWithValue }) => {
    try {
      await projectService.deleteProject(id);
      return id;
    } catch (error) {
      return rejectWithValue(error as ApiError);
    }
  }
);

export const toggleFeatured = createAsyncThunk<Project, string, { rejectValue: ApiError }>(
  'project/toggleFeatured',
  async (id, { rejectWithValue }) => {
    try {
      return await projectService.toggleFeatured(id);
    } catch (error) {
      return rejectWithValue(error as ApiError);
    }
  }
);

// Slice
const projectSlice = createSlice({
  name: 'project',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentProject: (state) => {
      state.currentProject = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch projects
      .addCase(fetchProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchProjects.fulfilled,
        (state, action: PayloadAction<PaginatedResponse<Project>>) => {
          state.loading = false;
          state.projects = action.payload.results;
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
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || null;
      })

      // Fetch featured projects
      .addCase(fetchFeaturedProjects.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchFeaturedProjects.fulfilled, (state, action: PayloadAction<Project[]>) => {
        state.loading = false;
        state.featuredProjects = action.payload;
      })
      .addCase(fetchFeaturedProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || null;
      })

      // Fetch project by ID
      .addCase(fetchProjectById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjectById.fulfilled, (state, action: PayloadAction<Project>) => {
        state.loading = false;
        state.currentProject = action.payload;
      })
      .addCase(fetchProjectById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || null;
      })

      // Create project
      .addCase(createProject.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(createProject.fulfilled, (state, action: PayloadAction<Project>) => {
        state.actionLoading = false;
        state.projects.unshift(action.payload);
      })
      .addCase(createProject.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload || null;
      })

      // Update project
      .addCase(updateProject.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(updateProject.fulfilled, (state, action: PayloadAction<Project>) => {
        state.actionLoading = false;
        const index = state.projects.findIndex((proj) => proj.id === action.payload.id);
        if (index !== -1) {
          state.projects[index] = action.payload;
        }
        if (state.currentProject?.id === action.payload.id) {
          state.currentProject = action.payload;
        }
      })
      .addCase(updateProject.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload || null;
      })

      // Delete project
      .addCase(deleteProject.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(deleteProject.fulfilled, (state, action: PayloadAction<string>) => {
        state.actionLoading = false;
        state.projects = state.projects.filter((proj) => proj.id !== action.payload);
      })
      .addCase(deleteProject.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload || null;
      })

      // Toggle featured
      .addCase(toggleFeatured.fulfilled, (state, action: PayloadAction<Project>) => {
        const index = state.projects.findIndex((proj) => proj.id === action.payload.id);
        if (index !== -1) {
          state.projects[index] = action.payload;
        }
      });
  },
});

export const { clearError, clearCurrentProject } = projectSlice.actions;
export default projectSlice.reducer;
