import {
    ChangeDetectionStrategy,
    Component,
    inject,
    OnInit
} from '@angular/core'
import { CommonModule } from '@angular/common'
import { MODAL_DATA, MODAL_REF } from './modal.tokens'

@Component({
    selector: 'app-test-base',
    standalone: true,
    imports: [CommonModule],
    template: `<div>Test Component - Data: {{ data | json }}</div>
        <button (click)="onClose()">Закрыть</button>`,
    styles: '',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TestBaseComponent implements OnInit {
    public data = inject(MODAL_DATA, { optional: true })
    private _modalRef = inject(MODAL_REF)

    public ngOnInit(): void {
        console.log(this.data)
    }

    public onClose(): void {
        this._modalRef.close()
    }
}
