export const typeDef = `#graphql 
type AuthenticatedUser {
  id: ID!
  username: String!
  email: String!
}

type AuthPayload {
    token: String
    user: AuthenticatedUser
  }
`;
