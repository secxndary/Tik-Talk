import { inject, Injectable } from "@angular/core";
import { CommentCreateDto } from "../interfaces/comment.interface";
import { HttpClient } from "@angular/common/http";
import { of, tap } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class CommentService {
    baseApiUrl = 'https://icherniakov.ru/yt-course';
    commentApiUrl = `${this.baseApiUrl}/comment`

    http = inject(HttpClient);

    createComment(comment: CommentCreateDto) {
        if (!comment)
            return of(undefined);

        console.log(comment)

        return this.http.post<Comment>(`${this.commentApiUrl}/`, comment);
    }
}