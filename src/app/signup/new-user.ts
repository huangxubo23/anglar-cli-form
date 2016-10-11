export class NewUser {
    userName: string = null;
    email: string = null
    telephone: string = null;
    password: string = null;
    confirmPassword: string = null;
    sex: string = 'male';
    age: number = null;
    address: string = null;
    habbies: string[] = [];
    constructor() {
        //this.address = new Address();
        //this.habbies = [];
    }
}

export class Address {
    country: string = null;
    province: string = null;
    city: string = null;
    postcode: string = null;
    street: string = null;
}
