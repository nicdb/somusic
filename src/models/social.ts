export interface User {
  id: string;
  email: string;
  username: string;
  realname: string;
  sex: string;
  birthdate: string;
  joinDate: string;
  avatar: string;
  avatar_big: string;
  avatar_original: string;
}

export interface Post {
  id: string;
  status: string;
  user_id: string;
  realname: string;
  likes_number: number;
  timestamp: string;
  name:string;
  comments:boolean;
  avatar_big:string;
}

export interface Comment {
  userId: string;
  commentEntityId: string;
  message: string;
  createStamp: string;
  attachment: any;
  id: string;
}

export interface Like {
  id: string;
  realname: string;
  postId: string;
  userId: string;
  timestamp: string;
}

export interface Notification {
  notificationId: string;
  idStatus: string;
  key: string;
  statusName: string;
  userId: number;
  realname: string;
  msg: string;
  userAvatar: string;
}

export interface Friendship {
  userId: string;
  friendId: string;
  status: string;
  timeStamp: string;
  viewed: number;
  active: number;
  notificationSent: number;
  id: number;
  realname: string;
}
