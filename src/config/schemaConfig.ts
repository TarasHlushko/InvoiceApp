import lodash from 'lodash';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { typeDef as User } from '../typeDefs/userTypeDef.js';
import { typeDef as Company } from '../typeDefs/companyTypeDef.js';
import { typeDef as CompanyMember } from '../typeDefs/companyMembersTypeDef.js';
import { typeDef as Client } from '../typeDefs/clientsTypeDef.js';
import { typeDef as InvoiceItem } from '../typeDefs/invoiceItemsTypeDef.js';
import { typeDef as Invoice } from '../typeDefs/invoiceTypeDef.js';
import { typeDef as CompanyMemberInvitation } from '../typeDefs/companyMemberInviteTypeDef.js';
import { typeDef as AuthPayload } from '../typeDefs/authPayload.js';
import { typeDef as pdfTypeDef } from '../typeDefs/pdfTypeDef.js';
import { typeDef as ListEntitiesByCompanyInput } from '../typeDefs/listEntitiesByCompanyInput.js';
import { typeDef as DeleteEntityInput } from '../typeDefs/deleteEntityTypeDef.js';
import { QueryTypeDef } from '../typeDefs/QueryTypeDef.js';
import { MutationTypeDef } from '../typeDefs/MutationTypeDef.js';
import userResolver from '../resolvers/userResolver.js';
import { companyResolver } from '../resolvers/companyResolver.js';
import { clientResolver } from '../resolvers/clientsResolver.js';
import { invoiceResolver } from '../resolvers/invoiceResolver.js';
import { invoiceItemsResolver } from '../resolvers/invoiceItemsResolver.js';
import { CompanyMemberInvitationResolver } from '../resolvers/companyMemberInvitationResolver.js';

const typeDefs = [
  User,
  Company,
  Client,
  CompanyMember,
  Invoice,
  InvoiceItem,
  QueryTypeDef,
  MutationTypeDef,
  CompanyMemberInvitation,
  AuthPayload,
  pdfTypeDef,
  ListEntitiesByCompanyInput,
  DeleteEntityInput,
];

const resolvers = lodash.merge(
  {},
  userResolver,
  companyResolver,
  clientResolver,
  invoiceResolver,
  invoiceItemsResolver,
  CompanyMemberInvitationResolver
);

export const schemaConfig = makeExecutableSchema({
  typeDefs,
  resolvers,
});