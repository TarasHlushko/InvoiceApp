export interface IInvoice {
  id: string;
  clientId: string;
  companyId: string;
  status: 'Created' | 'Sent' | 'Paid' | 'Overdue';
  dueDate: string;
  createdAt: string;
  updatedAt: string;
  deleteAt: string;
}
