export interface IUpdateClientInput {
  id: string;
  updatedClientFields: {
    name: string;
    email: string;
    country: string;
    zipCode: string;
    region: string;
    city: string;
    street: string;
    buildingNumber: string;
  };
}
