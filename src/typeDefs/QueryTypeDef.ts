export const QueryTypeDef = `#graphql
type Query {
    listUsersByCompany(findProperties: FindEntitiesByCompanyInput!): [User]
    getUserById(id: ID!): User
    getCompanyById(id: ID!): Company
    getInvoiceById(id: ID!): Invoice
    listClientByCompany(findProperties: FindEntitiesByCompanyInput!): [Client]
    listInvoicesByCompany(findProperties: FindEntitiesByCompanyInput!): [Invoice]
    getInvitationByUserId(userId: String!): [CompanyMemberInvitation]
},
`;
