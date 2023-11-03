export interface IInvoiceItem {
  id: string;
  invoiceId: string;
  description: string;
  rate: number;
  hours: number;
  total: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}
