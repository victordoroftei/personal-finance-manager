import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {UserModel} from "../models/user.model";

@Injectable({
  providedIn: 'root'
})

export class RegisterService {

  registerUrl: string = "http://localhost:8080/users/register";

  constructor(private http: HttpClient) {

  }

  register(firstName: string, lastName: string, emailAddress: string, password: string) {
    return this.http.post(this.registerUrl, new UserModel(0, firstName, lastName, emailAddress, password), {
      responseType: 'text'
    });
  }
}
