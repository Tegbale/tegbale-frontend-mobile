import { api } from './api';

export type PostAuthor = {
  id: string;
  firstName: string;
  lastName: string;
  role: string;
  avatar?: string;
};

export type Post = {
  id: string;
  content: string;
  imageUrl?: string;
  schoolId: string;
  authorId: string;
  author: PostAuthor;
  createdAt: string;
  _count: { comments: number };
};

export type Comment = {
  id: string;
  content: string;
  author: PostAuthor;
  createdAt: string;
  replies: Comment[];
};

type PostsResponse = { posts: Post[]; total: number };

export async function listPosts(page = 1, limit = 20): Promise<PostsResponse> {
  return api.get<PostsResponse>(`/v1/posts?page=${page}&limit=${limit}`);
}

export async function listComments(postId: string): Promise<Comment[]> {
  return api.get<Comment[]>(`/v1/posts/${postId}/comments`);
}

export async function createComment(postId: string, content: string, parentCommentId?: string): Promise<Comment> {
  return api.post<Comment>(`/v1/posts/${postId}/comments`, { content, parentCommentId });
}

export async function createPost(content: string, imageUrl?: string): Promise<Post> {
  return api.post<Post>('/v1/posts', { content, imageUrl });
}
