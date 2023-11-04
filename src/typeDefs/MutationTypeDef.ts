export const MutationTypeDef = `#graphql

type Mutation {
  createUser(user: CreateUserInput!): User!
  login(email: String!, password: String!): AuthPayload
  createCompany(company: CreateCompanyInput!): Company!
  createClient(client: CreateClientInput!): Client!
  createInvoice(invoice: CreateInvoiceInput!): Invoice!
  createInvoiceItem(invoiceItem: CreateInvoiceItemInput!): InvoiceItem!
  createCompanyMemberInvitation(invitation: createInvitationInput!): CompanyMemberInvitation!
  updateUser(id: ID!, updatedUserFields: UpdateUserInput!): User!
  updateCompany(id: ID!, updatedCompanyFields: UpdateCompanyInput!): Company!
  updateClient(id: ID!, updatedClientFields: UpdateClientInput!): Client!
  updateInvoice(id: ID!, updatedInvoiceFields: UpdateInvoiceInput!): Invoice!
  updateInvoiceItem(id: ID!, updatedInvoiceItemFields: UpdateInvoiceItemInput!): InvoiceItem!
  softDeleteInvoiceItem(id: ID!): DeleteEntityTypeDef!
  softDeleteCompany(id: ID!): DeleteEntityTypeDef!
  softDeleteUser(id: ID!): DeleteEntityTypeDef!
  softDeleteInvoice(id: ID!): DeleteEntityTypeDef!
  softDeleteClient(id: ID!): DeleteEntityTypeDef!
  softDeleteInvitationAfterResponse(id: ID!, invitationResponse: Boolean!): DeleteEntityTypeDef!
  generatePDFByInvoiceId(id: ID!): PDF!
}
`;
