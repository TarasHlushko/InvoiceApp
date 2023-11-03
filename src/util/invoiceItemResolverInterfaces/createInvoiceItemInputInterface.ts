export interface ICreateInvoiceItemInput {
  invoiceItem: {
    invoiceId: string;
    description: string;
    rate: number;
    hours: number;
  };
}
