import {
  Company as CompanyDb,
  CompanyMember as CompanyMemberDb,
  User as UserDb,
} from '../config/dbConfig.js';
import { IContext } from '../util/ContextInterface';
import { ICompany } from '../util/companyInterfaces/companyInterface';
import { ICreateCompanyInput } from '../util/companyInterfaces/createCompanyInputInterface';
import { IUpdateCompanyInput } from '../util/companyInterfaces/updateCompanyInputInterface';
import throwCustomError, { ErrorType } from '../util/error-handler.js';
import { ValidationError } from 'sequelize';

export const companyResolver = {
  Query: {
    async getCompanyById(_, args: ICompany) {
      const company = await CompanyDb.findByPk(args.id);

      if (!company) {
        throwCustomError('Company not found', ErrorType.NOT_FOUND);
      }

      return company;
    },
  },
  Mutation: {
    async createCompany(_, args: ICreateCompanyInput, context: IContext) {
      try {
        const company = await CompanyDb.create({
          name: args.company.name,
          ownerId: context.tokenPayload.id,
          zipCode: args.company.zipCode,
          country: args.company.country,
          city: args.company.city,
          street: args.company.street,
          buildingNumber: args.company.buildingNumber,
          region: args.company.region,
        });
        await CompanyMemberDb.create({
          userId: context.tokenPayload.id,
          companyId: company.id,
          role: 'Owner',
        });
        return company;
      } catch (err) {
        if (err instanceof ValidationError) {
          throwCustomError(`${err.message}`, ErrorType.BAD_REQUEST);
        }
        return err;
      }
    },

    async updateCompany(_, args: IUpdateCompanyInput, context: IContext) {
      try {
        const companyMember = await CompanyMemberDb.findByPk(
          context.tokenPayload.id
        );
        // Check for authorization
        if (companyMember.role !== 'Owner') {
          throwCustomError('Forbidden request', ErrorType.FORBIDDEN);
        }

        // Update the company
        await CompanyDb.update(args.updatedCompanyFields, {
          where: {
            id: companyMember.companyId,
          },
        });

        // Find the updated company
        return await CompanyDb.findByPk(companyMember.companyId);
      } catch (err) {
        if (err instanceof ValidationError) {
          throwCustomError(`${err.message}`, ErrorType.BAD_REQUEST);
        }
        return err;
      }
    },

    async softDeleteCompany(_, _args: ICompany, context: IContext) {
      const companyMember = await CompanyMemberDb.findByPk(
        context.tokenPayload.id
      );

      if (!companyMember.companyId) {
        throwCustomError('Company not found', ErrorType.NOT_FOUND);
      }

      // Check for authorization
      if (companyMember.role !== 'Owner') {
        throwCustomError('Forbidden request', ErrorType.FORBIDDEN);
      }

      await CompanyDb.destroy({
        where: {
          id: companyMember.companyId,
        },
      });

      return {
        status: 'success',
        data: 'null',
      };
    },
  },
  Company: {
    async ownerId(parent: ICompany) {
      const user = await UserDb.findByPk(parent.ownerId);
      if (!user) {
        throwCustomError('User was not found', ErrorType.NOT_FOUND);
      }
      return user;
    },
  },
};
