import { Component, OnDestroy, OnInit } from '@angular/core';
import { delay, Subscription } from 'rxjs';
import { Hospital } from 'src/app/models/hospital.model';
import { BusquedasService } from 'src/app/services/busquedas.service';
import { HospitalService } from 'src/app/services/hospital.service';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-hospitales',
  templateUrl: './hospitales.component.html',
  styleUrls: ['./hospitales.component.css']
})
export class HospitalesComponent implements OnInit,OnDestroy {

  public hospitales:Hospital[]=[];
  public cargando: boolean=true;
  private imgSubs: Subscription;
  constructor(private hospitalService:HospitalService,private modalImagenService:ModalImagenService,private busquedaService:BusquedasService) { }

  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }
  ngOnInit(): void {
    this.cargarHospitales();
    this.imgSubs= this.modalImagenService.nuevaImagen.pipe(delay(100)).subscribe(img=>this.cargarHospitales());

  }

  buscar(termino: string) {

    if (termino.length === 0) {
      return this.cargarHospitales();
    } else {
    return  this.busquedaService.buscar('hospitales', termino)
        .subscribe((resultados:Hospital[]) => {
          this.hospitales = resultados;
        });
    }


  }

  cargarHospitales(){
    this.cargando =true;
    this.hospitalService.cargarHospitales()
          .subscribe(hospitales=>{
            this.cargando=false;
            this.hospitales=hospitales;
          })
  }

  guardarCambios(hospital:Hospital){
    console.log(hospital);
    this.hospitalService.actualizarHospital(hospital._id,hospital.nombre)
    .subscribe(resp=>{
      Swal.fire('Actualizado',hospital.nombre,'success');
      this.cargarHospitales();
    })
  }
  eliminarHospital(hospital:Hospital){
    console.log(hospital);
    this.hospitalService.borrarHospital(hospital._id)
    .subscribe(resp=>{
      Swal.fire('Borrado',hospital.nombre,'success');
      this.cargarHospitales();
    })
  }

  async abrirSweetAlert(){
    const {value=''} = await Swal.fire<string>({
      title:'Crear Hospital',
      text:'Ingrese el nombre del nuevo hospital',
      input: 'text',
      inputPlaceholder: 'Nombre del Hospital',
      showCancelButton:true,
    })
    
    if(value.trim().length>0){
      this.hospitalService.crearHospital(value)
      .subscribe((resp:any)=>{
        this.hospitales.push(resp.hospital)
      })
    }
  }


  abrirModal(hospital:Hospital){
    this.modalImagenService.abrirModal('hospitales',hospital._id,hospital.img);
  }
}
