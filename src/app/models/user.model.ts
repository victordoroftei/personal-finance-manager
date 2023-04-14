export class UserModel {

  id!: number;
  firstname!: string;
  lastname!: string;
  emailAddress!: string;
  password!: string;
  phoneNumber!: string;

  constructor(id: number, firstname: string, lastname: string, emailAddress: string, password: string, phoneNumber: string) {
    this.id = id;
    this.firstname = firstname;
    this.lastname = lastname;
    this.emailAddress = emailAddress;
    this.password = password;
    this.phoneNumber = phoneNumber;
  }
}


