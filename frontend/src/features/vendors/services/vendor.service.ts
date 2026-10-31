import type { Vendor } from "../../../models/vendor";


let vendors: Vendor[] = [

  {
    id: "1",

    code: "V-001",

    shortName: "SUP",

    name: "Main Supplier",

    country: "Iran",

    city: "Tehran",

    address: "Tehran, Iran",

    contactPerson: "Admin",

    phone: "",

    email: "",

    website: "",

    registrationNumber: "",

    taxNumber: "",

    currency: "USD",

    paymentTerm: "30 Days",

    rating: 5,

    status: "Active",

    createdAt: new Date().toISOString(),

    updatedAt: new Date().toISOString(),
  }

];



class VendorService {


  async getAll(): Promise<Vendor[]> {

    return vendors;

  }




  async getById(
    id: string
  ): Promise<Vendor | null> {


    return (
      vendors.find(
        (x) => x.id === id
      )
      ??
      null
    );

  }





  async create(
    vendor: Vendor
  ) {


    vendors.push({

      ...vendor,

      id:
        vendor.id ||
        Date.now().toString(),

    });

  }





  async update(
    vendor: Vendor
  ) {


    vendors =
      vendors.map(
        (x) =>
          x.id === vendor.id
            ? vendor
            : x
      );


  }





  async delete(
    id: string
  ) {


    vendors =
      vendors.filter(
        (x) =>
          x.id !== id
      );


  }


}



export default new VendorService();