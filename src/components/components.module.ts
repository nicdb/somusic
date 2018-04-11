import { NgModule } from '@angular/core';
import { PostComponent } from './post/post';
import { CommentComponent } from './comment/comment';
import { AssignmentComponent } from './assignments/assignments';
import { UserComponent } from './user/user';
import { GroupPostComponent } from './group-post/group-post';
import { GroupCommentComponent } from './group-comment/group-comment';
import { IonicModule } from "ionic-angular";
import { DirectivesModule } from "../directives/directives.module";
@NgModule({
	declarations: [PostComponent,
    CommentComponent,
    AssignmentComponent,
    UserComponent,
    GroupPostComponent,
    GroupCommentComponent],
	imports: [IonicModule,
    DirectivesModule],
	exports: [PostComponent,
    CommentComponent,
    AssignmentComponent,
    UserComponent,
    GroupPostComponent,
    GroupCommentComponent],
  entryComponents:[
    PostComponent,
    CommentComponent,
    AssignmentComponent,
    UserComponent,
    GroupPostComponent,
    GroupCommentComponent
  ]
})
export class ComponentsModule {}
