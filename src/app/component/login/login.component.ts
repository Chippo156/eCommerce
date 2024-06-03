import { Component, ViewChild } from '@angular/core';
import { LoginDTO } from '../../dtos/loginDto';
import { Route, Router } from '@angular/router';
import { UserService } from '../../service/user.service';
import { LoginResponse } from '../../responses/LoginResponse';
import { TokenService } from '../../service/token.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  @ViewChild('loginForm') loginForm!: NgForm;
  phone_number: string;
  password: string;

  constructor(
    private router: Router,
    private userService: UserService,
    private tokenService: TokenService
  ) {
    this.phone_number = '';
    this.password = '';
  }
  login() {
    const message = `Phone number: ${this.phone_number}, Password: ${this.password}`;
    const loginDto: LoginDTO = {
      phone_number: this.phone_number,
      password: this.password,
    };
    this.userService.login(loginDto).subscribe({
      next: (response: LoginResponse) => {
        debugger;
        const { token } = response;
        this.tokenService.setToken(token);
      },
      complete: () => {
        debugger;
      },
      error: (error) => {
        debugger;
        console.log(error);
      },
    });
  }
}
