import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common'
import { BaseModalComponent, ModalRef } from './modal.model'
import { Subject } from 'rxjs'

@Component({
    selector: 'app-modal',
    standalone: true,
    imports: [CommonModule],
    template: '<div>asd asd</div>',
    styles: '',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TestBaseComponent implements BaseModalComponent, OnInit {
    // Реализуем BaseModalComponent
    public modalData?: Record<string, unknown>
    public modalRef?: ModalRef<unknown>
    public closeModal = new Subject<void>()

    public ngOnInit(): void {
        const data = this.modalData
        console.log(data)
    }
}
