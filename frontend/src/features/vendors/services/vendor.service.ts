import type { Vendor } from "../../../models/vendor";

let vendors: Vendor[] = [
  {
    id: 1,

    code: "VEN-001",

    shortName: "SIEMENS",

    name: "Siemens AG",

    country: "Germany",

    city: "Munich",

    address: "Munich",

    contactPerson: "Sales Manager",

    phone: "+49 111111",

    email: "sales@siemens.com",

    website: "https://www.siemens.com",

    registrationNumber: "REG-001",

    taxNumber: "TAX-001",

    currency: "EUR",

    paymentTerm: "30 Days",

    rating: 5,

    status: "Active",

    createdAt: new Date().toISOString(),

    updatedAt: new Date().toISOString(),
  },
];

class VendorService {
  async getAll(): Promise<Vendor[]> {
    return Promise.resolve(vendors);
  }

  async getById(id: number) {
    return Promise.resolve(
      vendors.find((x) => x.id === id)
    );
  }

  async create(item: Vendor) {
    vendors.push(item);

    return Promise.resolve();
  }

  async update(item: Vendor) {
    vendors = vendors.map((x) =>
      x.id === item.id ? item : x
    );

    return Promise.resolve();
  }

  async delete(id: number) {
    vendors = vendors.filter(
      (x) => x.id !== id
    );

    return Promise.resolve();
  }
}

export default new VendorService();