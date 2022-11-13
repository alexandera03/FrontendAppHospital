import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

@Component({
  selector: 'app-incrementador',
  templateUrl: './incrementador.component.html',
  styles: [
  ]
})
export class IncrementadorComponent implements OnInit {

  ngOnInit(): void {
    this.btnClass=`btn ${this.btnClass}`;
  }

  @Input() progreso: number = 50;

  @Input() btnClass:string='btn-primary';

  @Output() valorSalida: EventEmitter<number> = new EventEmitter();

  get getPorcentaje() {
    return `${this.progreso}%`;
  }

  cambiarValor(valor: number) {
    
    this.progreso += valor;
    this.valorSalida.emit(this.progreso);
    if (this.progreso < 0) {
      this.valorSalida.emit(0);
      this.progreso = 0;
    }
    if (this.progreso > 100) {
      this.valorSalida.emit(100);
      this.progreso = 100;
    }
    console.log(this.progreso);
  }

}
