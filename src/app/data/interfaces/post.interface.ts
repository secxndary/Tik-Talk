import { CommentEntity } from "./comment.interface";
import { Profile } from "./profile.interface";

export interface PostCreateDto {
    title: string;
    content: string;
    authorId: number;
    communityId: number;
}

export interface Post {
    id: number;
    title: string;
    communityId: number;
    content: string;
    author: Profile;
    images: string[];
    createdAt: string;
    updatedAt: string;
    likes: number;
    likesUsers: number[];
    comments: CommentEntity[];
}