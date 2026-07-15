import type { Vendor } from "../models/vendor";

const vendors: Vendor[] = [
  {
    id: 1,
    code: "VEN-001",
    shortName: "SIEMENS",
    name: "Siemens AG",
    country: "Germany",
    city: "Munich",
    address: "Munich",
    contactPerson: "John Smith",
    email: "sales@siemens.com",
    phone: "+49 123456",
    website: "https://www.siemens.com",
    taxNumber: "TX-001",
    registrationNumber: "RG-001",
    status: "Active",
    createdAt: "2026-01-01",
    updatedAt: "2026-07-15",
  },
  {
    id: 2,
    code: "VEN-002",
    shortName: "SCHNEIDER",
    name: "Schneider Electric",
    country: "France",
    city: "Paris",
    address: "Paris",
    contactPerson: "David Brown",
    email: "sales@se.com",
    phone: "+33 987654",
    website: "https://www.se.com",
    taxNumber: "TX-002",
    registrationNumber: "RG-002",
    status: "Active",
    createdAt: "2026-01-10",
    updatedAt: "2026-07-15",
  },
];

class VendorService {
  async getAll(): Promise<Vendor[]> {
    return Promise.resolve(vendors);
  }

  async getById(
    id: number
  ): Promise<Vendor | undefined> {
    return Promise.resolve(
      vendors.find((v) => v.id === id)
    );
  }

  async create(
    vendor: Vendor
  ): Promise<Vendor> {
    vendors.push(vendor);
    return Promise.resolve(vendor);
  }

  async update(
    vendor: Vendor
  ): Promise<Vendor> {
    const index = vendors.findIndex(
      (v) => v.id === vendor.id
    );

    if (index >= 0) {
      vendors[index] = vendor;
    }

    return Promise.resolve(vendor);
  }

  async delete(id: number): Promise<void> {
    const index = vendors.findIndex(
      (v) => v.id === id
    );

    if (index >= 0) {
      vendors.splice(index, 1);
    }

    return Promise.resolve();
  }
}

export default new VendorService();