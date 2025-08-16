import { ChangeDetectionStrategy, Component, computed, inject, input, Renderer2, signal } from '@angular/core';
import { Post } from '../../../data/interfaces/post.interface';
import { AvatarPlaceholderComponent } from '../../../common-ui/avatar-placeholder/avatar-placeholder.component';
import { ProfileNamePipe } from '../../../helpers/pipes/profile-name.pipe';
import { RouterLink } from '@angular/router';
import { RelativeDateTimePipe } from '../../../helpers/pipes/relative-datetime.pipe';
import { SvgIconComponent } from '../../../common-ui/svg-icon/svg-icon.component';
import { PostService } from '../../../data/services/post.service';
import { firstValueFrom } from 'rxjs';
import { ProfileService } from '../../../data/services/profile.service';
import { PostInputComponent } from "../post-input/post-input.component";
import { CommentComponent } from './comment/comment.component';

@Component({
    selector: 'app-post',
    imports: [
        AvatarPlaceholderComponent,
        ProfileNamePipe,
        RouterLink,
        RelativeDateTimePipe,
        SvgIconComponent,
        PostInputComponent,
        CommentComponent
    ],
    templateUrl: './post.component.html',
    styleUrl: './post.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PostComponent {
    postService = inject(PostService);
    profileService = inject(ProfileService);
    r2 = inject(Renderer2);
    meId = computed(() => this.profileService.me()?.id!);

    post = input<Post>();
    likes = computed(() => this.post()?.likes);
    likesUsers = computed(() => this.post()?.likesUsers);
    isPostLikedByMe = signal<boolean | undefined>(this.likesUsers()?.includes(this.meId()));

    onLikeButton(event: Event) {
        const likeWrapperElement = event.currentTarget as HTMLElement;

        if (!this.isPostLikedByMe()) {
            firstValueFrom(this.postService.createLike(this.post()?.id));
            this.r2.addClass(likeWrapperElement, 'active');
        }
        else {
            firstValueFrom(this.postService.removeLike(this.post()?.id));
            this.r2.removeClass(likeWrapperElement, 'active');
        }

        this.isPostLikedByMe.update(val => !val);
    }

    onCommentButton(event: Event) {

    }

    onSettingsButton(event: Event) {
        throw new Error('Method not implemented.');
    }

    ngOnInit() {
        console.log(this.post())
        console.log(this.likesUsers())
        console.log(this.isPostLikedByMe())
        console.log('\n')
    }
}