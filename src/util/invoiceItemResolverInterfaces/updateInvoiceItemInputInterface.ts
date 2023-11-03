export interface IUpdateInvoiceItemInput {
  id: string;
  updatedInvoiceItemFields: {
    description: string;
    rate: number;
    hours: number;
  };
}
