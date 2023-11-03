export const typeDef = `#graphql
    type Company {
    id: ID!
    name: String!
    ownerId: User!
    createdAt: String!
    updatedAt: String!
    deletedAt: String
    country: String!
    zipCode: String!
    region: String!
    city: String!
    street: String!
    buildingNumber: String!
}
input CreateCompanyInput {
    name: String!
    country: String!
    zipCode: String!
    region: String!
    city: String!
    street: String!
    buildingNumber: String!
}
input UpdateCompanyInput {
    name: String
    ownerId: String
    country: String
    zipCode: String
    region: String
    city: String
    street: String
    buildingNumber: String
}
`;
