import { CommonModule } from '@angular/common'
import { Component, EventEmitter, Input, Output } from '@angular/core'
import { IconComponent } from '@/app/components/icon/icon.component'

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [CommonModule, IconComponent],
  templateUrl: './input.component.html',
  styleUrl: './input.component.scss'
})
export class InputComponent {
  @Input() value = ''
  @Input() type!: 'text' | 'area' | 'select' | 'password'
  @Input() name = ''
  @Input() placeholder = ''
  @Input() options!: { value: string; label: string }[]
  @Output() onInput = new EventEmitter()

  isMenuOpen = false

  handleFocus() {
    if (this.type === 'select') {
      this.isMenuOpen = true
    }
  }

  handleInput($event: Event) {
    this.onInput.emit($event)
  }

  handleSelect(value: string) {
    this.isMenuOpen = false
    const $event = {
      target: {
        name: this.name,
        value
      }
    }
    this.onInput.emit($event)
  }
}
