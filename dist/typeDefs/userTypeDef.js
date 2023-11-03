export const typeDef = `#graphql 
type User {
    id: ID!
    username: String!
    email: String!
    password: String!
    createdAt: String
    updatedAt: String
    deletedAt: String
}
input CreateUserInput {
  username: String!
  email: String!
  password: String!
}

input UpdateUserInput {
  username: String
  email: String
  password: String
}
`;
