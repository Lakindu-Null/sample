export class Company {

    id!: number;
    name!: string;
    addressLine1!: string;
    addressLine2!: string;
    addressLine3!: string;
    telephone!: string;
    email!: string;

    constructor(
        name: string,
        addressLine1: string,
        addressLine2: string,
        addressLine3: string,
        telephone: string,
        email: string) 
        {
        this.name = name;
        this.addressLine1 = addressLine1;
        this.addressLine2 = addressLine2;
        this.addressLine3 = addressLine3;
        this.telephone = telephone;
        this.email = email;
    }

}

