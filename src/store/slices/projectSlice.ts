import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { 
  ProjectDetail,
  ProjectListItem,
  CreateProjectDTO, 
  UpdateProjectDTO, 
  PaginatedResponse,
  ApiError 
} from '../../types';
import { projectService } from '../../services';

export interface ProjectState {
  projects: ProjectListItem[];
  featuredProjects: ProjectDetail[];
  currentProject: ProjectDetail | null;
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

const toApiError = (payload: unknown): ApiError | null => (payload as ApiError | undefined) ?? null;

// Async thunks
export const fetchProjects = createAsyncThunk<
  PaginatedResponse<ProjectListItem>,
  { userId: string; page?: number },
  { rejectValue: ApiError }
>('project/fetchProjects', async ({ userId, page = 1 }, { rejectWithValue }) => {
  try {
    const result = await projectService.getProjectsByUser(userId, { page });
    return {
      results: result.results,
      count: result.count,
      next: result.next ?? undefined,
      previous: result.previous ?? undefined,
      page,
      pageSize: 10,
      totalPages: Math.ceil(result.count / 10),
    };
  } catch (error) {
    return rejectWithValue(error as ApiError);
  }
});

export const fetchFeaturedProjects = createAsyncThunk<
  ProjectDetail[],
  void,
  { rejectValue: ApiError }
>('project/fetchFeaturedProjects', async (_, { rejectWithValue }) => {
  try {
    return await projectService.getFeaturedProjects();
  } catch (error) {
    return rejectWithValue(error as ApiError);
  }
});

export const fetchProjectById = createAsyncThunk<ProjectDetail, string, { rejectValue: ApiError }>(
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
  ProjectDetail,
  CreateProjectDTO,
  { rejectValue: ApiError }
>('project/createProject', async (data, { rejectWithValue }) => {
  try {
    return await projectService.createProject(data, undefined, undefined);
  } catch (error) {
    return rejectWithValue(error as ApiError);
  }
});

export const updateProject = createAsyncThunk<
  ProjectDetail,
  { id: string; data: UpdateProjectDTO },
  { rejectValue: ApiError }
>('project/updateProject', async ({ id, data }, { rejectWithValue }) => {
  try {
    return await projectService.updateProject(id, data, undefined);
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

export const toggleFeatured = createAsyncThunk<ProjectDetail, string, { rejectValue: ApiError }>(
  'project/toggleFeatured',
  async (id, { rejectWithValue }) => {
    try {
      // Fetch current project and toggle featured status
      const project = await projectService.getProjectById(id);
      return await projectService.updateProject(id, { featured: !project.featured }, undefined);
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
        (state, action: PayloadAction<PaginatedResponse<ProjectListItem>>) => {
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
        state.error = toApiError(action.payload);
      })

      // Fetch featured projects
      .addCase(fetchFeaturedProjects.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchFeaturedProjects.fulfilled, (state, action: PayloadAction<ProjectDetail[]>) => {
        state.loading = false;
        state.featuredProjects = action.payload;
      })
      .addCase(fetchFeaturedProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = toApiError(action.payload);
      })

      // Fetch project by ID
      .addCase(fetchProjectById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjectById.fulfilled, (state, action: PayloadAction<ProjectDetail>) => {
        state.loading = false;
        state.currentProject = action.payload;
      })
      .addCase(fetchProjectById.rejected, (state, action) => {
        state.loading = false;
        state.error = toApiError(action.payload);
      })

      // Create project
      .addCase(createProject.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(createProject.fulfilled, (state, action: PayloadAction<ProjectDetail>) => {
        state.actionLoading = false;
        state.projects.unshift(action.payload as unknown as ProjectListItem);
      })
      .addCase(createProject.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = toApiError(action.payload);
      })

      // Update project
      .addCase(updateProject.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(updateProject.fulfilled, (state, action: PayloadAction<ProjectDetail>) => {
        state.actionLoading = false;
        const index = state.projects.findIndex((proj) => proj.id === action.payload.id);
        if (index !== -1) {
          state.projects[index] = action.payload as unknown as ProjectListItem;
        }
        if (state.currentProject?.id === action.payload.id) {
          state.currentProject = action.payload;
        }
      })
      .addCase(updateProject.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = toApiError(action.payload);
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
        state.error = toApiError(action.payload);
      })

      // Toggle featured
      .addCase(toggleFeatured.fulfilled, (state, action: PayloadAction<ProjectDetail>) => {
        const index = state.projects.findIndex((proj) => proj.id === action.payload.id);
        if (index !== -1) {
          state.projects[index] = action.payload as unknown as ProjectListItem;
        }
      });
  },
});

export const { clearError, clearCurrentProject } = projectSlice.actions;
export default projectSlice.reducer;
