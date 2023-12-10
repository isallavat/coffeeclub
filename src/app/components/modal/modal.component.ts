import { Component, EventEmitter, Input, Output } from '@angular/core'

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss'
})
export class ModalComponent {
  @Input() headTitle!: string
  @Output() onClose = new EventEmitter()

  close($event: MouseEvent) {
    this.onClose.emit($event)
  }
}
