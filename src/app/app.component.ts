import { Component } from '@angular/core'
import { TaskBoardComponent } from './features/tasks/components/task-board/task-board.component'
@Component({
    selector: 'app-root',
    imports: [TaskBoardComponent],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent {}
