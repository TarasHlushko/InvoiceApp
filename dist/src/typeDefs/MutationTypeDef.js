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
  softDeleteInvoiceItem(id: ID!): InvoiceItem
  softDeleteCompany(id: ID!): Company
  softDeleteUser(id: ID!): User
  softDeleteInvoice(id: ID!): Invoice
  softDeleteClient(id: ID!): Client
  softDeleteInvitationAfterResponse(id: ID!, invitationResponse: Boolean!): CompanyMemberInvitation
  generatePDFByInvoiceId(id: ID!): PDF!
}
`;
