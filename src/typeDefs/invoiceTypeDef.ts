export const typeDef = `#graphql
enum InvoiceStatus {
    Created
    Sent
    Paid
    Overdue
}

type Invoice {
    id: ID!
    clientId: Client!
    companyId: Company!
    status: InvoiceStatus!
    invoiceItems: [InvoiceItem]!
    dueDate: String!
    createdAt: String!
    updatedAt: String!
    deletedAt: String
}
input CreateInvoiceInput {
    clientId: String!
    dueDate: String!
}
input UpdateInvoiceInput {
    status: InvoiceStatus
    clientId: String
    dueDate: String
}
`;
