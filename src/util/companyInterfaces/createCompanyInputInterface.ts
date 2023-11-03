export interface ICreateCompanyInput {
  company: {
    name: string;
    country: string;
    zipCode: string;
    region: string;
    city: string;
    street: string;
    buildingNumber: string;
  };
}
