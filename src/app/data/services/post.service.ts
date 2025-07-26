import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Post, PostCreateDto } from "../interfaces/post.interface";

@Injectable({
    providedIn: 'root'
})
export class PostService {
    baseApiUrl = 'https://icherniakov.ru/yt-course';
    postApiUrl = `${this.baseApiUrl}/post`

    http = inject(HttpClient);

    createPost(post: PostCreateDto) {
        return this.http.post<Post>(`${this.postApiUrl}/`, post);
    }
}