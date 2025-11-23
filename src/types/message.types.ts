export type MessageType = 'general' | 'proposal' | 'job' | 'collaboration' | 'feedback' | 'other';
export type MessageStatus = 'new' | 'read' | 'in_progress' | 'responded' | 'archived';
export type MessagePriority = 'low' | 'medium' | 'high';

export interface Message {
  id: string;
  sender?: string;
  sender_name?: string;
  senderName?: string;
  sender_email?: string;
  senderEmail?: string;
  message_type?: MessageType;
  messageType?: MessageType;
  subject: string;
  message: string;
  project_budget?: string | null;
  projectBudget?: string | null;
  project_timeline?: string | null;
  projectTimeline?: string | null;
  attachments?: string[];
  status: MessageStatus;
  priority?: MessagePriority | boolean;
  admin_notes?: string | null;
  adminNotes?: string | null;
  responded_by?: string | null;
  respondedBy?: string | null;
  replied_by_name?: string | null;
  repliedByName?: string | null;
  response_message?: string | null;
  responseMessage?: string | null;
  responded_at?: string | null;
  respondedAt?: string | null;
  reply_count?: number;
  replyCount?: number;
  created_at?: string;
  createdAt?: string;
  updated_at?: string;
  updatedAt?: string;
}

export interface CreateMessageDTO {
  subject: string;
  message: string;
  messageType?: MessageType;
  message_type?: MessageType;
  projectBudget?: string;
  project_budget?: string;
  projectTimeline?: string;
  project_timeline?: string;
  priority?: MessagePriority;
}

export interface UpdateMessageDTO {
  status?: MessageStatus;
  adminNotes?: string;
  admin_notes?: string;
  priority?: MessagePriority;
}

export interface RespondMessageDTO {
  responseMessage: string;
  response_message?: string;
  status?: MessageStatus;
}
