import { Component, HostBinding, inject, input, Renderer2 } from '@angular/core';
import { AvatarPlaceholderComponent } from "../../../common-ui/avatar-placeholder/avatar-placeholder.component";
import { SvgIconComponent } from '../../../common-ui/svg-icon/svg-icon.component';
import { ProfileService } from '../../../data/services/profile.service';
import { PostService } from '../../../data/services/post.service';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { CommentService } from '../../../data/services/comment.service';

@Component({
    selector: 'app-post-input',
    imports: [AvatarPlaceholderComponent, SvgIconComponent, FormsModule],
    templateUrl: './post-input.component.html',
    styleUrl: './post-input.component.scss'
})
export class PostInputComponent {
    r2 = inject(Renderer2);
    postService = inject(PostService);
    commentService = inject(CommentService);

    isCommentInput = input<boolean>(false);
    postId = input<number>(0);

    @HostBinding('class.comment')
    get isComment() {
        return this.isCommentInput();
    }

    profile = inject(ProfileService).me();
    postText = '';

    onTextAreaInput(event: Event) {
        const textarea = event.target as HTMLTextAreaElement;

        this.r2.setStyle(textarea, 'height', 'auto');
        this.r2.setStyle(textarea, 'height', `${textarea.scrollHeight}px`);
    }

    onCreatePost() {
        if (!this.postText)
            return;

        if (this.isCommentInput()) {
            if (!this.postId())
                return;

            const comment = {
                text: this.postText,
                authorId: this.profile!.id,
                postId: this.postId()!,
                commentId: null
            };

            firstValueFrom(this.commentService.createComment(comment))
                .then(() => {
                    this.postText = '';
                });

            return;
        }

        const post = {
            title: '',
            content: this.postText,
            authorId: this.profile!.id,
            communityId: 0
        };

        firstValueFrom(this.postService.createPost(post))
            .then(() => {
                this.postText = '';
            });
    }

    ngOnInit() {
        console.log(this.isCommentInput())
    }
}
