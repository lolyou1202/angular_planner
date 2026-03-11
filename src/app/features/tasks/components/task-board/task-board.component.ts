import { Component, DestroyRef, inject, signal } from '@angular/core'
import { TaskGroupComponent } from '../task-group/task-group.component'
import { Group, Task } from '../../models/tasks.model'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { DragDropService } from '../../../../shared/services/drag-drop.service'

@Component({
    selector: 'app-task-board',
    templateUrl: './task-board.component.html',
    styleUrl: './task-board.component.scss',
    imports: [TaskGroupComponent]
})
export class TaskBoardComponent {
    protected readonly groups = signal<Group[]>([
    {
        id: 'grp-7f8e-9a2b',
        name: '📋 План разработки',
        color: '#4299e1',
        tasks: [
            {
                id: 'tsk-3a4b-5c6d',
                completed: false,
                archived: false,
                title: 'Создать архитектуру базы данных',
                description: 'Спроектировать схему таблиц для пользователей, проектов и задач. Оптимизировать индексы для частых запросов.',
                completedSubtasks: 3,
                totalSubtasks: 6,
                countAttachedFiles: 2,
                countAttachedLinks: 1,
                duration: 'long',
                priority: 'high',
                targetDate: '2026-03-25T00:00:00Z'
            },
            {
                id: 'tsk-7e8f-9a0b',
                completed: true,
                archived: false,
                title: 'Настроить CI/CD pipeline',
                description: 'GitHub Actions: автоматический запуск тестов и деплой на staging при пуше в main',
                completedSubtasks: 4,
                totalSubtasks: 4,
                countAttachedFiles: 1,
                priority: 'high',
                duration: 'quick',
                targetDate: '2026-03-10T00:00:00Z'
            },
            {
                id: 'tsk-1c2d-3e4f',
                completed: false,
                archived: false,
                title: 'Рефакторинг модуля авторизации',
                description: 'Вынести логику в отдельные сервисы, добавить интерцепторы для обработки ошибок',
                completedSubtasks: 1,
                totalSubtasks: 5,
                countAttachedLinks: 2,
                priority: 'medium',
                duration: 'long'
            },
            {
                id: 'tsk-5g6h-7i8j',
                completed: false,
                archived: true,
                title: 'Старая задача по оптимизации',
                description: 'Отложено до следующего квартала',
                priority: 'neutral'
            }
        ]
    },
    {
        id: 'grp-2b3c-4d5e',
        name: '🐛 Баги и исправления',
        color: '#f56565',
        tasks: [
            {
                id: 'tsk-9k0l-1m2n',
                completed: false,
                archived: false,
                title: 'Исправить отображение на мобильных устройствах',
                description: 'Меню накладывается на контент при ширине экрана меньше 768px',
                completedSubtasks: 0,
                totalSubtasks: 2,
                countAttachedFiles: 3,
                priority: 'high',
                duration: 'quick'
            },
            {
                id: 'tsk-3o4p-5q6r',
                completed: false,
                archived: false,
                title: 'Ошибка 500 при сохранении задачи',
                description: 'Валидация даты не срабатывает, если поле пустое',
                completedSubtasks: 1,
                totalSubtasks: 3,
                countAttachedLinks: 1,
                priority: 'high',
                duration: 'quick',
                targetDate: '2026-03-15T00:00:00Z'
            },
            {
                id: 'tsk-7s8t-9u0v',
                completed: true,
                archived: false,
                title: 'Исправить цвета в тёмной теме',
                description: 'Текст становится нечитаемым на некоторых компонентах',
                completedSubtasks: 2,
                totalSubtasks: 2,
                countAttachedFiles: 2,
                priority: 'medium',
                duration: 'quick',
                targetDate: '2026-03-08T00:00:00Z'
            }
        ]
    },
    {
        id: 'grp-5f6g-7h8i',
        name: '📚 Документация',
        color: '#e5d62e',
        tasks: [
            {
                id: 'tsk-1w2x-3y4z',
                completed: false,
                archived: false,
                title: 'Написать README для проекта',
                description: 'Описание установки, настройки и основных команд. Добавить бейджи с версией и лицензией.',
                completedSubtasks: 2,
                totalSubtasks: 4,
                countAttachedFiles: 1,
                priority: 'low',
                duration: 'long'
            },
            {
                id: 'tsk-5a6b-7c8d',
                completed: false,
                archived: false,
                title: 'Документировать API эндпоинты',
                description: 'Использовать Swagger/OpenAPI для автоматической генерации документации',
                completedSubtasks: 0,
                totalSubtasks: 5,
                countAttachedLinks: 2,
                priority: 'medium',
                duration: 'long',
                targetDate: '2026-04-01T00:00:00Z'
            },
            {
                id: 'tsk-9e0f-1g2h',
                completed: true,
                archived: false,
                title: 'Обновить диаграмму архитектуры',
                description: 'Добавить новые сервисы и их взаимодействие',
                completedSubtasks: 1,
                totalSubtasks: 1,
                countAttachedFiles: 2,
                priority: 'low',
                duration: 'quick',
                targetDate: '2026-03-05T00:00:00Z'
            }
        ]
    },
    {
        id: 'grp-3h4i-5j6k',
        name: '✨ Новые фичи',
        color: '#9f7aea',
        tasks: [
            {
                id: 'tsk-7k8l-9m0n',
                completed: false,
                archived: false,
                title: 'Добавить экспорт задач в PDF',
                description: 'Возможность экспортировать список задач с фильтрацией и сортировкой',
                completedSubtasks: 2,
                totalSubtasks: 7,
                countAttachedFiles: 1,
                countAttachedLinks: 3,
                priority: 'medium',
                duration: 'long',
                targetDate: '2026-04-15T00:00:00Z'
            },
            {
                id: 'tsk-1o2p-3q4r',
                completed: false,
                archived: false,
                title: 'Уведомления в Telegram',
                description: 'Интеграция с ботом для получения уведомлений о приближающихся дедлайнах',
                completedSubtasks: 1,
                totalSubtasks: 4,
                priority: 'high',
                duration: 'long'
            },
            {
                id: 'tsk-5s6t-7u8v',
                completed: false,
                archived: false,
                title: 'Командная работа: комментарии к задачам',
                description: 'Добавить возможность обсуждать задачи в комментариях с упоминаниями коллег',
                completedSubtasks: 0,
                totalSubtasks: 6,
                countAttachedLinks: 1,
                priority: 'high',
                duration: 'long',
                targetDate: '2026-05-01T00:00:00Z'
            },
            {
                id: 'tsk-9w0x-1y2z',
                completed: false,
                archived: false,
                title: 'Тёмная тема',
                description: 'Добавить переключение между светлой и тёмной темой интерфейса',
                completedSubtasks: 3,
                totalSubtasks: 3,
                priority: 'low',
                duration: 'quick'
            }
        ]
    },
    {
        id: 'grp-9z8y-7x6w',
        name: '✅ Завершённые',
        color: '#48bb78',
        tasks: [
            {
                id: 'tsk-5v4u-3t2s',
                completed: true,
                archived: false,
                title: 'Настроить базовую аутентификацию',
                description: 'Регистрация, вход, восстановление пароля',
                completedSubtasks: 5,
                totalSubtasks: 5,
                countAttachedFiles: 1,
                priority: 'high',
                duration: 'long',
                targetDate: '2026-02-15T00:00:00Z'
            },
            {
                id: 'tsk-1r0q-9p8o',
                completed: true,
                archived: false,
                title: 'Создать дашборд статистики',
                description: 'Графики с количеством выполненных задач по дням/неделям',
                completedSubtasks: 3,
                totalSubtasks: 3,
                countAttachedLinks: 1,
                priority: 'medium',
                duration: 'long',
                targetDate: '2026-02-28T00:00:00Z'
            },
            {
                id: 'tsk-7n6m-5l4k',
                completed: true,
                archived: true,
                title: 'Интеграция с Jira (устаревшее)',
                description: 'Заменили на внутренний API',
                priority: 'neutral'
            },
            {
                id: 'tsk-3j2h-1g0f',
                completed: true,
                archived: false,
                title: 'Добавить drag-n-drop для задач',
                description: 'Перемещение задач между колонками и внутри колонки',
                completedSubtasks: 4,
                totalSubtasks: 4,
                countAttachedFiles: 2,
                priority: 'high',
                duration: 'quick',
                targetDate: '2026-03-01T00:00:00Z'
            }
        ]
    }
])

    private _destroyRef = inject(DestroyRef)
    private _dragDropService = inject(DragDropService<Task>)

    public ngOnInit(): void {
        this._dragDropService.dropComplete$
            .pipe(takeUntilDestroyed(this._destroyRef))
            .subscribe(
                ({ data: task, sourceZoneId, targetZoneId, targetIndex }) => {
                    if (
                        task &&
                        sourceZoneId &&
                        targetZoneId &&
                        targetIndex !== -1
                    ) {
                        this._moveTask(
                            task,
                            sourceZoneId,
                            targetZoneId,
                            targetIndex
                        )
                    }
                }
            )
    }

    private _moveTask(
        task: Task,
        sourceGroupId: string,
        targetGroupId: string,
        targetIndex: number
    ): void {
        this.groups.update(groups => {
            const newGroups = groups.map(g => ({
                ...g,
                tasks: [...g.tasks]
            }))

            const sourceGroup = newGroups.find(g => g.id === sourceGroupId)
            const targetGroup = newGroups.find(g => g.id === targetGroupId)
            if (!sourceGroup || !targetGroup) return groups

            const taskIndex = sourceGroup.tasks.findIndex(t => t.id === task.id)
            if (taskIndex === -1) return groups

            const [removedTask] = sourceGroup.tasks.splice(taskIndex, 1)

            const adjustedTargetIndex =
                sourceGroupId === targetGroupId && taskIndex < targetIndex
                    ? targetIndex - 1
                    : targetIndex

            targetGroup.tasks.splice(adjustedTargetIndex, 0, removedTask)

            return newGroups
        })
    }
}
