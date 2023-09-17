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
