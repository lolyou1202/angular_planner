import { Component, computed, HostBinding, input } from '@angular/core'

@Component({
    selector: 'app-progress-ring',
    standalone: true,
    templateUrl: './progress-ring.component.html',
    styleUrl: './progress-ring.component.scss',
    imports: []
})
export class ProgressRingComponent {
    public readonly completed = input<number>(0)
    public readonly total = input<number>(4)
    public readonly size = input<number>(16)

    protected readonly dashOffset = computed(() => {
        // Длина окружности: 2πr = 2 * 3.1416 * 6
        const circumference = 37.7

        const percent = this.total() > 0 ? this.completed() / this.total() : 0
        return circumference - percent * circumference
    })

    protected readonly colorClass = computed(() => {
        const p = this.completed() / this.total()
        if (p === 1) return 'completed'
        if (p >= 0.75) return 'high'
        if (p >= 0.35) return 'medium'
        return 'low'
    })

    @HostBinding('style.--size')
    public get hostStyleSize(): string | undefined {
        return this.size() + 'px'
    }
}