import { Component, effect, inject, input, Input } from '@angular/core';
import { PostInputComponent } from "../post-input/post-input.component";
import { PostComponent } from "../post/post.component";
import { Profile } from '../../../data/interfaces/profile.interface';
import { PostService } from '../../../data/services/post.service';
import { firstValueFrom } from 'rxjs';

@Component({
    selector: 'app-post-feed',
    imports: [PostInputComponent, PostComponent],
    templateUrl: './post-feed.component.html',
    styleUrl: './post-feed.component.scss'
})
export class PostFeedComponent {
    postService = inject(PostService);
    profile = input<Profile>();

    posts = this.postService.posts;

    constructor() {
        effect(() => {
            firstValueFrom(this.postService.getPosts(this.profile()?.id))
        })
    }
}
