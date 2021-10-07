import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UsuarioModel } from '../models/usuario.model';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private url = 'https://identitytoolkit.googleapis.com/v1/accounts';
  private apiKEY = 'AIzaSyCZ-2E3d0BaD-_L14abysLAceRIQrPk6JE';
  userToken: string;
/* Crear nuevo usuario
https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=[API_KEY]
LOGIN
https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=[API_KEY] */

  constructor( private http: HttpClient) {
    this.leerToken();
   }

    logout() {
      localStorage.removeItem('token');

    }
    login(usuario: UsuarioModel) {
      const authData = {
        ...usuario,
        returnSecureToken: true
      };

      return this.http.post(
        `${this.url}/:signInWithPassword?key=${this.apiKEY}`,
        authData
        ).pipe(
          map( resp => {
            this.guardarToken(resp['idToken']);
            return resp;
          })
        );

    }
    nuevousuario(usuario: UsuarioModel) {

    const authData = {
      ...usuario,
      returnSecureToken: true
    };
    return this.http.post(
      `${this.url}/:signUp?key=${this.apiKEY}`,
      authData
      ).pipe(
      map( resp => {
        this.guardarToken(resp['idToken']);
        return resp;
      })
    );
    }
    private guardarToken( idToken: string) {
      this.userToken = idToken;
      localStorage.setItem('token', idToken);

      let hoy = new Date();
      hoy.setSeconds( 3600 );

      localStorage.setItem('expira', hoy.getTime().toString());

    }
    leerToken() {
      if (localStorage.getItem('token')) {
        this.userToken = localStorage.getItem('token');
      } else {
        this.userToken = '';
      }
      return this.userToken;
    }
    estaAutenticado(): boolean {

      if (this.userToken.length < 2) {
        return false;
      }

      const expira = Number (localStorage.getItem('expira'));
      const expiraDate = new Date();
      expiraDate.setTime(expira);

      if (expiraDate > new Date()) {
        return true;
      } else {
        return false;
      }

      return this.userToken.length > 2;
    }

}
