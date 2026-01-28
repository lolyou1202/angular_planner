import { Component, computed, input } from '@angular/core'

@Component({
    selector: 'app-progress-ring',
    standalone: true,
    templateUrl: './progress-ring.component.html',
    styleUrl: './progress-ring.component.scss'
})
export class ProgressRingComponent {
    completed = input<number>(0)
    total = input<number>(4)
    size = input<string>('16px')

    dashOffset = computed(() => {
        // Длина окружности: 2πr = 2 * 3.1416 * 40 = ~251.2
        const circumference = 251.2

        const percent =
            this.total() > 0
                ? this.completed() / this.total()
                : 0
        return circumference - percent * circumference
    })

    // В компоненте
    colorClass = computed(() => {
        const p = this.completed() / this.total()
        if (p === 1) return '--completed'
        if (p >= 0.75) return '--high'
        if (p >= 0.35) return '--medium'
        return '--low'
    })
}
