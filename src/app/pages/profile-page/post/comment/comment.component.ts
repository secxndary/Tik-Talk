import { Component, input } from '@angular/core';
import { AvatarPlaceholderComponent } from '../../../../common-ui/avatar-placeholder/avatar-placeholder.component';
import { RelativeDateTimePipe } from '../../../../helpers/pipes/relative-datetime.pipe';
import { RouterLink } from '@angular/router';
import { ProfileNamePipe } from '../../../../helpers/pipes/profile-name.pipe';
import { CommentEntity } from '../../../../data/interfaces/comment.interface';

@Component({
    selector: 'app-comment',
    imports: [
        AvatarPlaceholderComponent,
        ProfileNamePipe,
        RouterLink,
        RelativeDateTimePipe
    ],
    templateUrl: './comment.component.html',
    styleUrl: './comment.component.scss'
})
export class CommentComponent {
    comment = input<CommentEntity>();
}
