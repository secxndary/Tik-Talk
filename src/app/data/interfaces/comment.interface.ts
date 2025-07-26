import { Profile } from "./profile.interface";

export interface Comment {
    id: number;
    text: string;
    author: Profile;
    postId: number;
    commentId: number;
    createdAt: string;
    updatedAt: string;
}

export interface CommentCreateDto {
    text: string;
    authorId: number;
    postId: number;
    commentId: number;
}