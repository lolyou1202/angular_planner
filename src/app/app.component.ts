import { Component, signal, inject } from '@angular/core'
import { BorderGroupComponent } from './shared/components/border-group/border-group.component'
import { BorderGroupChildComponent } from './shared/components/border-group-child/border-group-child.component'
import { TestBaseComponent } from './shared/components/modal-forms/test-base-modal.component'
import { ModalService } from './core/modal/modal.service'
import { MenuService } from './core/menu/menu.service'
import { BadgeComponent } from './shared/components/badge/badge.component'
import { TaskCardComponent } from './features/tasks/task-card/task-card.component'
import { Task } from './features/tasks/models/tasks.model'

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
    imports: [
        BorderGroupComponent,
        BorderGroupChildComponent,
        BadgeComponent,
        TaskCardComponent
    ]
})
export class AppComponent {
    private _modalService = inject(ModalService)
    private _menuService = inject(MenuService)

    public onClickModal(): void {
        const modalRef = this._modalService.open(TestBaseComponent, {
            title: 'asd',
            data: {
                asd: 'asd',
                qwe: {
                    zxc: 'zxc'
                },
                anotherProperty: 123
            },
            actions: [
                {
                    variant: 'white-bordered',
                    text: 'Сбросить',
                    onClick: (): void => {}
                },
                {
                    variant: 'primary',
                    text: 'Применить',
                    onClick: (): void => {
                        this._modalService.close()
                    }
                }
            ]
        })

        modalRef.afterClosed.subscribe(() => {
            console.log('asdasdasd')
        })
    }

    public openMenu(event: MouseEvent): void {
        const origin = event.currentTarget as HTMLElement
        if (origin) {
            const menuRef = this._menuService.openMenu(origin, {
                items: [
                    {
                        label: 'Редактировать',
                        action: (): void => {
                            this._menuService.close()
                        }
                    },
                    {
                        label: 'Копировать'
                    },
                    'separator',
                    {
                        label: 'Удалить',
                        disabled: true
                    },
                    { label: 'Закрыть', action: (): void => menuRef.close() }
                ]
            })

            menuRef.afterClosed.subscribe(() => console.log('Меню закрыто'))
        }
    }
}
    protected bageState = signal(false)
    protected tasks = signal<Task[]>([
        {
            id: 'task-1332',
            completed: false,
            archived: false,
            title: 'asdasd',
            completedSubtasks: 5,
            totalSubtasks: 5,
            countAttachedFiles: 6,
            countAttachedLinks: 2,
            duration: 'quick',
            priority: 'medium',
            targetDate: '2024-11-04T00:00:00Z'
        },
        {
            id: 'task-1333',
            completed: false,
            archived: false,
            title: 'фывфф',
            description:
                'Протереть пф as f asdf sad f sdfsdfsd fsdf sdf sd fsdqwwwFWNKF F SDF SDAB Sv',
            completedSubtasks: 5,
            totalSubtasks: 8,
            countAttachedFiles: 6,
            countAttachedLinks: 11,
            priority: 'neutral',
            targetDate: '2024-11-04T00:00:00Z'
        },
        {
            id: 'task-1330',
            completed: false,
            archived: false,
            title: 'фывфф',
            description: 'Протереть пф as f',
            duration: 'long',
            priority: 'high'
        },
        {
            id: 'task-1334',
            completed: true,
            archived: false,
            title: 'фывфф',
            description:
                'Протереть пф as f asdf sad f sdfsdfsd fsdf sdf sd fsdqwwwFWNKF F SDF SDAB Sv',
            countAttachedFiles: 0,
            countAttachedLinks: 1,
            duration: 'long',
            priority: 'high',
            targetDate: '2024-03-17T00:00:00Z'
        },
        {
            id: 'task-1335',
            completed: false,
            archived: false,
            title: 'фывфф',
            description:
                'Протереть пф as f asdf sad f sdfsdfsd fsdf sdf sd fsdqwwwFWNKF F SDF SDAB Sv qsad asd asd asdqw qwdwqd qw',
            completedSubtasks: 0,
            totalSubtasks: 8,
            countAttachedFiles: 6,
            countAttachedLinks: 2,
            duration: 'quick',
            priority: 'low',
            targetDate: '2024-11-04T00:00:00Z'
        }
    ])

    protected toggle(): void {
        this.bageState.set(!this.bageState())
    }
}
