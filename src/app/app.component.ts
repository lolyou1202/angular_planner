import { Component, signal, inject } from '@angular/core'
import { BorderGroupComponent } from './shared/components/border-group/border-group.component'
import { BorderGroupChildComponent } from './shared/components/border-group-child/border-group-child.component'
import { BadgeComponent } from './shared/components/badge/badge.component'
import { TestBaseComponent } from './shared/components/modal-forms/test-base-modal.component'
import { ModalService } from './core/modal/modal.service'
import { MenuService } from './core/menu/menu.service'

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
    imports: [BorderGroupComponent, BorderGroupChildComponent, BadgeComponent]
})
export class AppComponent {
    protected bageState = signal(false)

    protected toggle(): void {
        this.bageState.set(!this.bageState())
    }

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