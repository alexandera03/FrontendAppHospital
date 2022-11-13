import { Component, OnDestroy, OnInit } from '@angular/core';
import { delay, Subscription } from 'rxjs';
import { Usuario } from 'src/app/models/usuario.model';
import { BusquedasService } from 'src/app/services/busquedas.service';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit,OnDestroy {

  public totalUsuarios: number = 0;
  public usuarios: Usuario[] = [];
  public usuariosTemp: Usuario[] = [];
  public pag: number = 0;
  public cargando: boolean = true;
  public imgSubs: Subscription;
  constructor(private usuarioService: UsuarioService, private busquedaService: BusquedasService,private modalImagenService:ModalImagenService) { }

  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }
  ngOnInit(): void {

    this.cargarUsuarios();
    this.imgSubs= this.modalImagenService.nuevaImagen.pipe(delay(100)).subscribe(img=>this.cargarUsuarios());

  }


  cargarUsuarios() {
    this.cargando = true;
    this.usuarioService.cargarUsuarios(this.pag)
      .subscribe(({ total, usuarios }) => {
        this.totalUsuarios = total;
        if (usuarios.length !== 0) {
          this.usuarios = usuarios
          this.usuariosTemp = usuarios;
          this.cargando = false;
        }
        this.cargando = false;
      })
  }
  cambiarPagina(valor: number) {
    this.pag += valor;

    if (this.pag < 0) {
      this.pag = 0;
    } else if (this.pag > this.totalUsuarios) {
      this.pag -= valor;
    }

    this.cargarUsuarios();

  }

  buscar(termino: string) {

    if (termino.length === 0) {
      this.usuarios = this.usuariosTemp;
    } else {
      this.busquedaService.buscar('usuarios', termino)
        .subscribe((resultados:Usuario[]) => {
          this.usuarios = resultados;
        });
    }


  }


  eliminarUsuario(usuario: Usuario){

    if(usuario._id=== this.usuarioService.uid){
     return Swal.fire('Error','No puede borrarse a si mismo','error');
    }

    return Swal.fire({
      title: '¿Borrar Usuario?',
      text: `Esta a punto de borrar a ${usuario.nombre}`,
      icon: 'question',
      showCancelButton: true,

      confirmButtonText: 'Borrar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.usuarioService.eliminarUsuario(usuario._id)
            .subscribe(resp=>{
              Swal.fire(
                'Borrado!',
                `El usuario ${usuario.nombre} fue borrado`,
                'success'
              )
                this.cargarUsuarios();
            });
      }
    })
  }


  cambiarRole(usuario:Usuario){
    console.log(usuario);

    this.usuarioService.guardarUsuario(usuario)
        .subscribe(resp=>{
          console.log(resp);
        })
  }

  abrirModal(usuario:Usuario){
    console.log(usuario)
    this.modalImagenService.abrirModal('usuarios',usuario._id,usuario.img);
  }
}
