import { Injectable } from '@angular/core';
import { environtment } from '../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RegisterDto } from '../dtos/registerDto';
import { Observable } from 'rxjs';
import { LoginDTO } from '../dtos/loginDto';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiRegister = `${environtment.apiBaseUrl}/users/register`;
  private apiLogin = `${environtment.apiBaseUrl}/users/login`;
  private apiConfig = {
    headers: this.createHeaders(),
  };
  private createHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept-Language': 'vi',
      Authorization: '',
    });
  }
  constructor(private http: HttpClient) {}

  register(registerDto: RegisterDto): Observable<any> {
    return this.http.post(this.apiRegister, registerDto, this.apiConfig);
  }

  login(loginDto: LoginDTO): Observable<any> {
    return this.http.post(this.apiLogin, loginDto, this.apiConfig);
  }
}
