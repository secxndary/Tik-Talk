import { HttpClient } from "@angular/common/http";
import { inject, Injectable, signal } from "@angular/core";
import { Post, PostCreateDto } from "../interfaces/post.interface";
import { ProfileService } from "./profile.service";
import { of, switchMap, tap } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class PostService {
    baseApiUrl = 'https://icherniakov.ru/yt-course';
    postApiUrl = `${this.baseApiUrl}/post`

    http = inject(HttpClient);

    me = inject(ProfileService).me();
    posts = signal<Post[]>([]);

    getMyPosts() {
        return this.http.get<Post[]>(`${this.postApiUrl}/`)
            .pipe(
                tap(val => this.posts.set(val))
            );
    }

    getPosts(accountId: number | undefined) {
        if (!accountId) {
            return of(undefined);
        }

        return this.http.get<Post[]>(
            `${this.postApiUrl}/`,
            {
                params: {
                    user_id: accountId
                }
            })
            .pipe(
                tap(val => this.posts.set(val))
            );
    }

    createPost(post: PostCreateDto) {
        return this.http.post<Post>(`${this.postApiUrl}/`, post)
            .pipe(
                switchMap(() => this.getMyPosts())  //  getMyPosts или getPosts(id)?
            );
    }
}