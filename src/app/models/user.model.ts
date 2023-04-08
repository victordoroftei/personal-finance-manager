export class UserModel {

  id!: number;
  firstname!: string;
  lastname!: string;
  emailAddress!: string;
  password!: string;

  constructor(id: number, firstname: string, lastname: string, emailAddress: string, password: string) {
    this.id = id;
    this.firstname = firstname;
    this.lastname = lastname;
    this.emailAddress = emailAddress;
    this.password = password;
  }
}


