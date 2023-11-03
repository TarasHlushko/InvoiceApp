export interface IUpdateInvoiceInput {
  id: string;
  updatedInvoiceFields: {
    status: string;
    dueDate: string;
    clientId: string;
  };
}
