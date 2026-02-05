import { Component, inject } from '@angular/core'
import { BorderGroupComponent } from './shared/components/border-group/border-group.component'
import { BorderGroupChildComponent } from './shared/components/border-group-child/border-group-child.component'
import { ModalService } from './shared/components/modal/modal.service'
import { TestBaseComponent } from './shared/components/modal/test-base-modal.component'
@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
    imports: [BorderGroupComponent, BorderGroupChildComponent]
})
export class AppComponent {
    private _modalService = inject(ModalService)

    public onClickModal(): void {
        const modalRef = this._modalService.open(TestBaseComponent, {
            title: '__TITLE__',
            data: {
                asd: 'asd'
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
}
