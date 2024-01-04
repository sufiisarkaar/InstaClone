import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
loginForm : FormGroup;
  constructor(private _loginService:LoginService, private _formBuilder:FormBuilder){
    this.loginForm = this._formBuilder.group({
      username : this._formBuilder.control('',[Validators.required]),
      password : this._formBuilder.control('',[Validators.required])
    });
  }

login(){
const _loginData = this.loginForm.value;
this._loginService._userLogin(_loginData).subscribe((res)=>{
  console.log(res,"login Response");
  
})

}

}
