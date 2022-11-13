import { Injectable, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, delay, map, of, tap } from 'rxjs';
import { Observable } from 'rxjs'
import { RegisterForm } from '../interfaces/register-form.interface';
import { LoginForm } from '../interfaces/login-form.interface';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { CargarUsuario } from '../interfaces/cargar-usuarios.interface';

import { Usuario } from '../models/usuario.model';

declare const google: any;
const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  public usuario: Usuario;
  constructor(private http: HttpClient, private router: Router, private ngzone: NgZone) { }

  get token(): string {
    return localStorage.getItem('token') || '';
  }
  get uid(): string {
    return this.usuario._id || '';
  }

  get headers() {
    return {
      headers: {
        'x-token': this.token
      }
    }
  }

  logout() {
    localStorage.removeItem('token');


    google.accounts.id.revoke('a03.alexis@gmail.com', done => {
      console.log(done.error)
      this.ngzone.run(() => {

        this.router.navigateByUrl('/login');
      })
    })
  }



  validarToken(): Observable<boolean> {
    return this.http.get(`${base_url}/login/renew`, {
      headers: {
        'x-token': this.token
      }
    }).pipe(
      map((resp: any) => {
        const { nombre, email, img, google, role, _id } = resp.usuario;
        this.usuario = new Usuario(nombre, email, '', img, google, role, _id)
        localStorage.setItem('token', resp.token);
        return true;
      }),
      catchError(error => {
        console.log(error)
        return of(false)
      }
      )
    );

  }

  crearUsuario(formData: RegisterForm) {
    const token = localStorage.getItem('token') || '';
    return this.http.post(`${base_url}/usuarios`, formData)
      .pipe(
        tap((resp: any) => {
          localStorage.setItem('token', resp.token);
        })
      );

  }


  actualizarPerfil(data: { email: string, nombre: string, role: string }) {
    data = {
      ...data,
      role: this.usuario.role
    }
    return this.http.put(`${base_url}/usuarios/${this.uid}`, data, this.headers);
  }

  login(formData: LoginForm) {
    return this.http.post(`${base_url}/login`, formData)
      .pipe(
        tap((resp: any) => {
          localStorage.setItem('token', resp.token);
        })
      );
  }


  loginGoogle(token: string) {
    return this.http.post(`${base_url}/login/google`, { token })
      .pipe(
        tap((resp: any) => {
          localStorage.setItem('token', resp.token);
        })
      );
  }

  cargarUsuarios(desde: number = 0) {
    const url = `${base_url}/usuarios?desde=${desde}`
    return this.http.get<CargarUsuario>(url, this.headers)
      .pipe(
        delay(1000),
        map(resp => {
          const usuarios = resp.usuarios.map(
            user => new Usuario(user.nombre, user.email, '', user.img, user.google, user.role, user._id)
          );
          return {
            total: resp.total,
            usuarios
          };
        })
      )
  }

  eliminarUsuario(uid: string) {

    const url = `${base_url}/usuarios/${uid}`
    return this.http.delete(url, this.headers);
  }


  guardarUsuario(usuario: Usuario) {
    return this.http.put(`${base_url}/usuarios/${usuario._id}`, usuario, this.headers);
  }
}
