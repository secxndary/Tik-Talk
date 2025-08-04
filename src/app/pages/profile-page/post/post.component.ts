import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { Post } from '../../../data/interfaces/post.interface';
import { AvatarPlaceholderComponent } from '../../../common-ui/avatar-placeholder/avatar-placeholder.component';
import { ProfileNamePipe } from '../../../helpers/pipes/profile-name.pipe';
import { RouterLink } from '@angular/router';
import { RelativeDateTimePipe } from '../../../helpers/pipes/relative-datetime.pipe';

@Component({
    selector: 'app-post',
    imports: [AvatarPlaceholderComponent, ProfileNamePipe, RouterLink, RelativeDateTimePipe],
    templateUrl: './post.component.html',
    styleUrl: './post.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PostComponent {
    post = input<Post>();
    author = computed(this.post)()?.author;
}