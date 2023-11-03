export const typeDef = `#graphql
enum MemberRole {
    Owner
    Member
}

type CompanyMember {
    userId: User!
    companyId: Company!
    createdAt: String!
    updatedAt: String!
    deletedAt: String
}
`;
