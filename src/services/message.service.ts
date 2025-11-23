import apiClient from './api';
import type {
  Message,
  CreateMessageDTO,
  UpdateMessageDTO,
  RespondMessageDTO,
  PaginatedResponse,
  QueryParams,
} from '../types';

const MESSAGE_BASE_PATH = '/contacts';
const MESSAGE_LIST_URL = `${MESSAGE_BASE_PATH}/`;
const messageDetailUrl = (id: string) => `${MESSAGE_BASE_PATH}/${id}/`;
const messageRespondUrl = (id: string) => `${MESSAGE_BASE_PATH}/${id}/respond/`;

const serializeQueryParams = (
  params?: (QueryParams & Record<string, unknown>) | undefined
): Record<string, unknown> | undefined => {
  if (!params) {
    return undefined;
  }

  const { pageSize, ...rest } = params;
  if (pageSize === undefined) {
    return rest;
  }

  return { ...rest, page_size: pageSize };
};

const mapMessageResponse = (payload: Record<string, any>): Message => {
  return {
    id: String(payload.id ?? ''),
    sender: payload.sender ?? undefined,
    sender_name: payload.sender_name ?? payload.senderName ?? undefined,
    senderName: payload.sender_name ?? payload.senderName ?? undefined,
    sender_email: payload.sender_email ?? payload.senderEmail ?? undefined,
    senderEmail: payload.sender_email ?? payload.senderEmail ?? undefined,
    message_type: payload.message_type ?? payload.messageType ?? 'general',
    messageType: payload.message_type ?? payload.messageType ?? 'general',
    subject: payload.subject ?? '',
    message: payload.message ?? '',
    project_budget: payload.project_budget ?? payload.projectBudget ?? null,
    projectBudget: payload.project_budget ?? payload.projectBudget ?? null,
    project_timeline: payload.project_timeline ?? payload.projectTimeline ?? null,
    projectTimeline: payload.project_timeline ?? payload.projectTimeline ?? null,
    attachments: Array.isArray(payload.attachments) ? payload.attachments : [],
    status: payload.status ?? 'new',
    priority: payload.priority ?? false,
    admin_notes: payload.admin_notes ?? payload.adminNotes ?? null,
    adminNotes: payload.admin_notes ?? payload.adminNotes ?? null,
    responded_by: payload.responded_by ?? payload.respondedBy ?? null,
    respondedBy: payload.responded_by ?? payload.respondedBy ?? null,
    replied_by_name: payload.replied_by_name ?? payload.repliedByName ?? null,
    repliedByName: payload.replied_by_name ?? payload.repliedByName ?? null,
    response_message: payload.response_message ?? payload.responseMessage ?? null,
    responseMessage: payload.response_message ?? payload.responseMessage ?? null,
    responded_at: payload.responded_at ?? payload.respondedAt ?? null,
    respondedAt: payload.responded_at ?? payload.respondedAt ?? null,
    reply_count: typeof payload.reply_count === 'number' ? payload.reply_count : (payload.replyCount ?? 0),
    replyCount: typeof payload.reply_count === 'number' ? payload.reply_count : (payload.replyCount ?? 0),
    created_at: payload.created_at ?? payload.createdAt ?? undefined,
    createdAt: payload.created_at ?? payload.createdAt ?? undefined,
    updated_at: payload.updated_at ?? payload.updatedAt ?? undefined,
    updatedAt: payload.updated_at ?? payload.updatedAt ?? undefined,
  };
};

const mapPaginatedMessages = (
  payload: Record<string, any>
): PaginatedResponse<Message> => {
  const results = Array.isArray(payload.results)
    ? payload.results.map(mapMessageResponse)
    : [];

  const inferredPageSize =
    payload.pageSize ?? payload.page_size ?? (results.length > 0 ? results.length : 1);

  return {
    results,
    count: payload.count ?? results.length,
    next: payload.next ?? undefined,
    previous: payload.previous ?? undefined,
    page: payload.page ?? payload.current ?? 1,
    pageSize: inferredPageSize,
    totalPages:
      payload.totalPages ??
      payload.total_pages ??
      (payload.count && inferredPageSize
        ? Math.max(1, Math.ceil(payload.count / inferredPageSize))
        : 1),
  };
};

const serializeMessagePayload = (
  payload: CreateMessageDTO | UpdateMessageDTO | RespondMessageDTO
): Record<string, unknown> => {
  const body: Record<string, unknown> = {};

  if ('subject' in payload && payload.subject !== undefined) {
    body.subject = payload.subject;
  }

  if ('message' in payload && payload.message !== undefined) {
    body.message = payload.message;
  }

  if ('messageType' in payload && payload.messageType !== undefined) {
    body.message_type = payload.messageType;
  } else if ('message_type' in payload && payload.message_type !== undefined) {
    body.message_type = payload.message_type;
  }

  if ('projectBudget' in payload && payload.projectBudget !== undefined) {
    body.project_budget = payload.projectBudget;
  } else if ('project_budget' in payload && payload.project_budget !== undefined) {
    body.project_budget = payload.project_budget;
  }

  if ('projectTimeline' in payload && payload.projectTimeline !== undefined) {
    body.project_timeline = payload.projectTimeline;
  } else if ('project_timeline' in payload && payload.project_timeline !== undefined) {
    body.project_timeline = payload.project_timeline;
  }

  if ('priority' in payload && payload.priority !== undefined) {
    body.priority = payload.priority;
  }

  if ('status' in payload && payload.status !== undefined) {
    body.status = payload.status;
  }

  if ('adminNotes' in payload && payload.adminNotes !== undefined) {
    body.admin_notes = payload.adminNotes;
  } else if ('admin_notes' in payload && payload.admin_notes !== undefined) {
    body.admin_notes = payload.admin_notes;
  }

  if ('responseMessage' in payload && payload.responseMessage !== undefined) {
    body.response_message = payload.responseMessage;
  } else if ('response_message' in payload && payload.response_message !== undefined) {
    body.response_message = payload.response_message;
  }

  return body;
};

export const messageService = {
  /**
   * Get all messages/contacts (admin)
   */
  getAllMessages: async (params?: QueryParams & Record<string, unknown>): Promise<PaginatedResponse<Message>> => {
    const response = await apiClient.get(MESSAGE_LIST_URL, {
      params: serializeQueryParams(params),
    });
    return mapPaginatedMessages(response.data ?? {});
  },

  /**
   * Get message by ID
   */
  getMessageById: async (id: string): Promise<Message> => {
    const response = await apiClient.get(messageDetailUrl(id));
    return mapMessageResponse(response.data ?? {});
  },

  /**
   * Create new message/contact (public or authenticated)
   */
  createMessage: async (data: CreateMessageDTO): Promise<Message> => {
    const response = await apiClient.post(
      MESSAGE_LIST_URL,
      serializeMessagePayload(data)
    );
    return mapMessageResponse(response.data ?? {});
  },

  /**
   * Update message (admin)
   */
  updateMessage: async (
    id: string,
    data: UpdateMessageDTO
  ): Promise<Message> => {
    const response = await apiClient.patch(
      messageDetailUrl(id),
      serializeMessagePayload(data)
    );
    return mapMessageResponse(response.data ?? {});
  },

  /**
   * Delete message (admin)
   */
  deleteMessage: async (id: string): Promise<void> => {
    await apiClient.delete(messageDetailUrl(id));
  },

  /**
   * Respond to message (admin/staff)
   */
  respondToMessage: async (
    id: string,
    data: RespondMessageDTO
  ): Promise<Message> => {
    const response = await apiClient.post(
      messageRespondUrl(id),
      serializeMessagePayload(data)
    );
    return mapMessageResponse(response.data ?? {});
  },
};
