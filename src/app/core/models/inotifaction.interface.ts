export interface INotification {
  _id: string;
  recipient: Recipient;
  actor: Recipient;
  type: string;
  entityType: string;
  entityId: string;
  isRead: boolean;
  createdAt: string;
  entity: Entity;
  readAt?: string;
}

export interface Entity {
  _id: string;
  body: string;
  user: string;
  commentsCount: number;
  topComment: TopComment | null;
  sharesCount: number;
  likesCount: number;
  isShare: boolean;
  id: string;
  image?: string;
}

export interface TopComment {
  _id: string;
  content: string;
  commentCreator: CommentCreator;
  post: string;
  parentComment: null;
  likes: any[];
  createdAt: string;
}

export interface CommentCreator {
  _id: string;
  name: string;
  username: string;
  photo: string;
}

export interface Recipient {
  _id: string;
  name: string;
  photo: string;
}
