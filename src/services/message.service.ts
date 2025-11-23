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

const mapMessageResponse = (payload: Record<string, unknown>): Message => {
  return {
    id: String(payload.id ?? ''),
    sender: typeof payload.sender === 'string' ? payload.sender : undefined,
    sender_name: typeof payload.sender_name === 'string' ? payload.sender_name : (typeof payload.senderName === 'string' ? payload.senderName : undefined),
    senderName: typeof payload.sender_name === 'string' ? payload.sender_name : (typeof payload.senderName === 'string' ? payload.senderName : undefined),
    sender_email: typeof payload.sender_email === 'string' ? payload.sender_email : (typeof payload.senderEmail === 'string' ? payload.senderEmail : undefined),
    senderEmail: typeof payload.sender_email === 'string' ? payload.sender_email : (typeof payload.senderEmail === 'string' ? payload.senderEmail : undefined),
    message_type: (payload.message_type ?? payload.messageType ?? 'general') as Message['messageType'],
    messageType: (payload.message_type ?? payload.messageType ?? 'general') as Message['messageType'],
    subject: typeof payload.subject === 'string' ? payload.subject : '',
    message: typeof payload.message === 'string' ? payload.message : '',
    project_budget: typeof payload.project_budget === 'string' ? payload.project_budget : (typeof payload.projectBudget === 'string' ? payload.projectBudget : null),
    projectBudget: typeof payload.project_budget === 'string' ? payload.project_budget : (typeof payload.projectBudget === 'string' ? payload.projectBudget : null),
    project_timeline: typeof payload.project_timeline === 'string' ? payload.project_timeline : (typeof payload.projectTimeline === 'string' ? payload.projectTimeline : null),
    projectTimeline: typeof payload.project_timeline === 'string' ? payload.project_timeline : (typeof payload.projectTimeline === 'string' ? payload.projectTimeline : null),
    attachments: Array.isArray(payload.attachments) ? payload.attachments.filter((item): item is string => typeof item === 'string') : [],
    status: (payload.status ?? 'new') as Message['status'],
    priority: payload.priority as Message['priority'],
    admin_notes: typeof payload.admin_notes === 'string' ? payload.admin_notes : (typeof payload.adminNotes === 'string' ? payload.adminNotes : null),
    adminNotes: typeof payload.admin_notes === 'string' ? payload.admin_notes : (typeof payload.adminNotes === 'string' ? payload.adminNotes : null),
    responded_by: typeof payload.responded_by === 'string' ? payload.responded_by : (typeof payload.respondedBy === 'string' ? payload.respondedBy : null),
    respondedBy: typeof payload.responded_by === 'string' ? payload.responded_by : (typeof payload.respondedBy === 'string' ? payload.respondedBy : null),
    replied_by_name: typeof payload.replied_by_name === 'string' ? payload.replied_by_name : (typeof payload.repliedByName === 'string' ? payload.repliedByName : null),
    repliedByName: typeof payload.replied_by_name === 'string' ? payload.replied_by_name : (typeof payload.repliedByName === 'string' ? payload.repliedByName : null),
    response_message: typeof payload.response_message === 'string' ? payload.response_message : (typeof payload.responseMessage === 'string' ? payload.responseMessage : null),
    responseMessage: typeof payload.response_message === 'string' ? payload.response_message : (typeof payload.responseMessage === 'string' ? payload.responseMessage : null),
    responded_at: typeof payload.responded_at === 'string' ? payload.responded_at : (typeof payload.respondedAt === 'string' ? payload.respondedAt : null),
    respondedAt: typeof payload.responded_at === 'string' ? payload.responded_at : (typeof payload.respondedAt === 'string' ? payload.respondedAt : null),
    reply_count: typeof payload.reply_count === 'number' ? payload.reply_count : (typeof payload.replyCount === 'number' ? payload.replyCount : 0),
    replyCount: typeof payload.reply_count === 'number' ? payload.reply_count : (typeof payload.replyCount === 'number' ? payload.replyCount : 0),
    created_at: typeof payload.created_at === 'string' ? payload.created_at : (typeof payload.createdAt === 'string' ? payload.createdAt : undefined),
    createdAt: typeof payload.created_at === 'string' ? payload.created_at : (typeof payload.createdAt === 'string' ? payload.createdAt : undefined),
    updated_at: typeof payload.updated_at === 'string' ? payload.updated_at : (typeof payload.updatedAt === 'string' ? payload.updatedAt : undefined),
    updatedAt: typeof payload.updated_at === 'string' ? payload.updated_at : (typeof payload.updatedAt === 'string' ? payload.updatedAt : undefined),
  };
};

const mapPaginatedMessages = (
  payload: Record<string, unknown>
): PaginatedResponse<Message> => {
  const results = Array.isArray(payload.results)
    ? payload.results.map(mapMessageResponse)
    : [];

  const inferredPageSize =
    (payload.pageSize as number) ?? (payload.page_size as number) ?? (results.length > 0 ? results.length : 1);

  const count = (payload.count as number) ?? results.length;

  return {
    results,
    count,
    next: (payload.next as string) ?? undefined,
    previous: (payload.previous as string) ?? undefined,
    page: (payload.page as number) ?? (payload.current as number) ?? 1,
    pageSize: inferredPageSize,
    totalPages:
      (payload.totalPages as number) ??
      (payload.total_pages as number) ??
      (count && inferredPageSize
        ? Math.max(1, Math.ceil(count / inferredPageSize))
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
