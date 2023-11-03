export const typeDef = `#graphql
type InvoiceItem {
    id: ID!
    invoiceId: Invoice!
    description: String!
    rate: Float!
    hours: Int!
    total: Float!
    createdAt: String!
    updatedAt: String!
    deletedAt: String
}

input CreateInvoiceItemInput {
    invoiceId: String!
    description: String!
    rate: Float!
    hours: Int!
}

input UpdateInvoiceItemInput {
    description: String
    rate: Float
    hours: Int
}
`;
