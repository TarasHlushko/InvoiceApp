export interface IUpdateCompanyInput {
  id: string;
  updatedCompanyFields: {
    name: string;
    ownerId: string;
    country: string;
    zipCode: string;
    region: string;
    city: string;
    street: string;
    buildingNumber: string;
  };
}
