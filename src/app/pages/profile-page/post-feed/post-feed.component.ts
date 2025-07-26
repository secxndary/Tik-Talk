import { Component, input, Input } from '@angular/core';
import { PostInputComponent } from "../post-input/post-input.component";
import { PostComponent } from "../post/post.component";
import { Profile } from '../../../data/interfaces/profile.interface';

@Component({
    selector: 'app-post-feed',
    imports: [PostInputComponent, PostComponent],
    templateUrl: './post-feed.component.html',
    styleUrl: './post-feed.component.scss'
})
export class PostFeedComponent {
    @Input() profile!: Profile;
    isPostInputShown = input<boolean>(false);
}
