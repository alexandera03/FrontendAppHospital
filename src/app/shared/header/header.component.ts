import { Component, OnInit } from '@angular/core';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Usuario } from '../../models/usuario.model';
import { Router } from '@angular/router';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: [
  ]
})
export class HeaderComponent implements OnInit {
  public usuario: Usuario;

  constructor(private usuarioService:UsuarioService,private router: Router) {
    this.usuario = usuarioService.usuario;
    
   }

  ngOnInit(): void {
  }

  logout(){
    this.usuarioService.logout();
  }

}
