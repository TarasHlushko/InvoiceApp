import {
  Client as ClientDb,
  Company as CompanyDb,
  CompanyMember as CompanyMemberDb,
} from '../config/dbConfig.js';
import { IContext } from '../util/ContextInterface';
import { IClient } from '../util/clientResolverInterface/clientInterface';
import { IClientMutationInput } from '../util/clientResolverInterface/clientMutationInput';
import { IUpdateClientInput } from '../util/clientResolverInterface/updateClientInput';
import { IFindEntitiesInput } from '../util/FindEntitiesInputInterface';
import throwCustomError, { ErrorType } from '../util/error-handler.js';
import { ValidationError } from 'sequelize';

export const clientResolver = {
  Query: {
    async listClientByCompany(_, args: IFindEntitiesInput, context: IContext) {
      // Check for authorization
      const companyMember = await CompanyMemberDb.findByPk(
        context.tokenPayload.id
      );
      if (!companyMember.companyId) {
        throwCustomError('Forbidden request', ErrorType.FORBIDDEN);
      }

      const currentPage = args.findProperties.currentPage || 1;
      const itemsPerPage = args.findProperties.itemsPerPage || 10;
      const offset = (currentPage - 1) * itemsPerPage;
      // Retrieve clients by company ID
      const clients = await ClientDb.findAll({
        where: {
          companyId: companyMember.companyId,
        },
        offset,
        limit: itemsPerPage,
      });

      // Check if any clients were found
      if (!clients || clients.length === 0) {
        throwCustomError('No clients were found', ErrorType.NOT_FOUND);
      }

      return clients;
    },
  },

  Mutation: {
    async createClient(_, args: IClientMutationInput, context: IContext) {
      try {
        // Check for authorization
        const companyMember = await CompanyMemberDb.findByPk(
          context.tokenPayload.id
        );
        if (!companyMember.companyId) {
          throwCustomError('Forbidden request', ErrorType.FORBIDDEN);
        }

        // Check for valid 'client' data
        if (!args.client) {
          throwCustomError('No input was found', ErrorType.BAD_USER_INPUT);
        }

        // Create and return the new client
        const client = await ClientDb.create({
          companyId: companyMember.companyId,
          name: args.client.name,
          email: args.client.email,
          zipCode: args.client.zipCode,
          country: args.client.country,
          city: args.client.city,
          street: args.client.street,
          buildingNumber: args.client.buildingNumber,
          region: args.client.region,
        });
        return client;
      } catch (err) {
        if (err instanceof ValidationError) {
          throwCustomError(`${err.message}`, ErrorType.BAD_REQUEST);
        }
        return err;
      }
    },

    async updateClient(_, args: IUpdateClientInput, context: IContext) {
      try {
        // Check for authorization and initial client data
        const [companyMember, initialClient] = await Promise.all([
          CompanyMemberDb.findByPk(context.tokenPayload.id),
          ClientDb.findByPk(args.id),
        ]);

        if (!initialClient) {
          throwCustomError('No client was found', ErrorType.NOT_FOUND);
        }

        if (
          !companyMember ||
          initialClient.companyId !== companyMember.companyId
        ) {
          throwCustomError('Forbidden request', ErrorType.FORBIDDEN);
        }

        // Update the client and return the updated version
        await ClientDb.update(args.updatedClientFields, {
          where: {
            id: args.id,
          },
        });

        return await ClientDb.findByPk(args.id);
      } catch (err) {
        if (err instanceof ValidationError) {
          throwCustomError(`${err.message}`, ErrorType.BAD_REQUEST);
        }
        return err;
      }
    },

    async softDeleteClient(_, args: IClient, context: IContext) {
      // Check for authorization and client existence
      const [companyMember, client] = await Promise.all([
        CompanyMemberDb.findByPk(context.tokenPayload.id),
        ClientDb.findByPk(args.id),
      ]);

      if (companyMember.companyId !== client.companyId) {
        throwCustomError('Forbidden request', ErrorType.FORBIDDEN);
      }

      // Soft delete the client and return null
      await ClientDb.destroy({
        where: {
          id: args.id,
        },
      });

      return {
        status: 'success',
        data: 'null',
      };
    },
  },
  Client: {
    async companyId(parent: IClient) {
      const company = await CompanyDb.findByPk(parent.companyId);

      if (!company) {
        throwCustomError('No company was found', ErrorType.NOT_FOUND);
      }

      return company;
    },
  },
};
