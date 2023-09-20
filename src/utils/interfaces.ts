export interface MessageContent {
  content_type: string;
  parts: string[];
}

export interface MessageAuthor {
  role: string;
  name: string | null;
  metadata: Record<string, any>;
}

export interface Message {
  id: string;
  author: MessageAuthor;
  create_time: number | null;
  update_time: number | null;
  content: MessageContent;
  status: string;
  end_turn: boolean | null;
  weight: number;
  metadata: Record<string, any>;
  recipient: string;
}

export interface ChatMessage {
  id: string;
  message: Message | null;
  parent: string | null;
  children: string[];
}

export interface Conversation {
  title: string;
  create_time: number;
  update_time: number;
  mapping: Record<string, ChatMessage>;
  moderation_results: any[]; // You can define a more specific type for moderation results
  current_node: string;
  plugin_ids: any[] | null; // Define a specific type if applicable
  conversation_id: string;
  conversation_template_id: string | null;
  id: string;
}

export type User = {
  id: string;
  name: string;
  email: string;
  picture: string;
  createdAt: Date;
  openAiApiKey: string;
};

export type SessionObject = {
  user: User;
};

export type FileStatus =
  | "uploaded"
  | "processed"
  | "pending"
  | "error"
  | "deleting"
  | "deleted";

export type FinetuneJob = {
  created_at: number;
  error: string;
  fine_tuned_model: string;
  finished_at: number;
  hyperparameters: { n_epochs: number };
  id: string;
  model: string;
  object: string;
  organization_id: string;
  result_files: string[];
  status: string;
  trained_tokens: number;
  training_file: string;
  validation_file: string;
};
