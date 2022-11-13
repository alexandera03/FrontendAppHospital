import { Component, OnInit,AfterViewInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2'

declare const google:any;
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements AfterViewInit{

  @ViewChild('googleBtn') googleBtn:ElementRef;
  public formSubmitted = false;
  loginForm: FormGroup;


  constructor(private router: Router, private fb: FormBuilder, private usuarioService: UsuarioService,private ngzone:NgZone) {

    this.loginForm = this.fb.group({
      email: [localStorage.getItem('email') || '', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      remember: [false]

    });
  }


ngAfterViewInit(): void {
  this.googleInit();
}

googleInit(){
  google.accounts.id.initialize({
    client_id: "820901653076-3vscgcdc0c9jghrtn598vcierfo55a2h.apps.googleusercontent.com",
    callback: (response:any) => this.handleCredentialResponse(response)
  });
  google.accounts.id.renderButton(
    this.googleBtn.nativeElement,
    { theme: "outline", size: "large" }  // customization attributes
  );
}

handleCredentialResponse(response:any){
 
  this.usuarioService.loginGoogle(response.credential)
  .subscribe(resp=>{

    //navega al dashboard
    this.ngzone.run(()=>{
      this.router.navigateByUrl('/');

    })
  })
}

  login() {

    this.usuarioService.login(this.loginForm.value)
      .subscribe(resp => {
        console.log(resp)
        if (this.loginForm.get('remember').value) {
          localStorage.setItem('email', this.loginForm.get('email').value);
          
        } else {
          localStorage.removeItem('email');
        }
        this.router.navigateByUrl('/');
      }, (err) => {
        Swal.fire('Error', err.error.msg, 'error')
      })
    //
  }

}
