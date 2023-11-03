export const typeDef = `#graphql
type CompanyMemberInvitation {
    id: ID!
    userId: User!
    companyId: Company!
}

input createInvitationInput {
    email: String!
}

input acceptInvitationInput {
    id: String!
}
`;
