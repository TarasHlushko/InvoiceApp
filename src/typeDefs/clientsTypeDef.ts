export const typeDef = `#graphql 
type Client {
    id: ID!
    name: String!
    email: String
    companyId: Company!
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
input CreateClientInput {
    name: String!
    email: String
    country: String!
    zipCode: String!
    region: String!
    city: String!
    street: String!
    buildingNumber: String!
}
input UpdateClientInput {
    name: String
    email: String
    country: String
    zipCode: String
    region: String
    city: String
    street: String
    buildingNumber: String
}
`;
