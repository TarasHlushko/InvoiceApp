import { ValidationError } from 'sequelize';
import {
  CompanyMemberInvitation as CompanyMemberInvitationDb,
  User as UserDb,
  Company as CompanyDb,
  CompanyMember as CompanyMemberDb,
} from '../config/dbConfig.js';
import { IContext } from '../util/ContextInterface';
import { ICompanyMemberInvitation } from '../util/companyMemberInvitationInterfaces/companyMemberInvitation';
import { ICreateInvitationInput } from '../util/companyMemberInvitationInterfaces/createInvitationInputInterface';
import { IResponseToInvitation } from '../util/companyMemberInvitationInterfaces/responseToInvitationInterface';
import throwCustomError, { ErrorType } from '../util/error-handler.js';
import sendMail from '.././util/emailSender.js';

export const CompanyMemberInvitationResolver = {
  Query: {
    async getInvitationByUserId(_, _args, context: IContext) {
      const invitations = await CompanyMemberInvitationDb.findAll({
        where: {
          userId: context.tokenPayload.id,
        },
      });

      if (!invitations || invitations.length === 0) {
        throwCustomError('Invitations was not found', ErrorType.NOT_FOUND);
      }

      return invitations;
    },
  },
  Mutation: {
    async createCompanyMemberInvitation(
      _,
      args: ICreateInvitationInput,
      context: IContext
    ) {
      try {
        // Check if the user is authorized
        const companyMember = await CompanyMemberDb.findByPk(
          context.tokenPayload.id
        );
        if (!companyMember || companyMember.role !== 'Owner') {
          throwCustomError('Forbidden request', ErrorType.FORBIDDEN);
        }

        // Find the user by email
        const user = await UserDb.findOne({
          where: { email: args.invitation.email },
        });
        //Check if user exist
        if (!user) {
          throwCustomError(
            'There is no user with this email',
            ErrorType.NOT_FOUND
          );
        }
        // Create a company member invitation
        const invitation = await CompanyMemberInvitationDb.create({
          companyId: companyMember.companyId,
          userId: user.id,
        });

        if (invitation) {
          sendMail(
            user.email,
            'Invitation',
            `${user.username}, you got invited to the company`
          );
        }

        return invitation;
      } catch (err) {
        if (err instanceof ValidationError) {
          throwCustomError(`${err.message}`, ErrorType.BAD_REQUEST);
        }
        return err;
      }
    },

    async softDeleteInvitationAfterResponse(
      _,
      args: IResponseToInvitation,
      context: IContext
    ) {
      try {
        const invitation = await CompanyMemberInvitationDb.findByPk(args.id);

        if (context.tokenPayload.id !== invitation.userId) {
          throwCustomError('Forbidden request', ErrorType.FORBIDDEN);
        }

        if (args.invitationResponse) {
          await CompanyMemberDb.create({
            userId: invitation.userId,
            companyId: invitation.companyId,
            role: 'Member',
          });
        }

        await CompanyMemberInvitationDb.destroy({
          where: {
            id: args.id,
          },
        });
        return {
          status: 'success',
          data: 'null',
        };
      } catch (err) {
        if (err instanceof ValidationError) {
          throwCustomError(`${err.message}`, ErrorType.BAD_REQUEST);
        }
        return err;
      }
    },
  },
  CompanyMemberInvitation: {
    async userId(invitation: ICompanyMemberInvitation) {
      return UserDb.findByPk(invitation.userId);
    },
    async companyId(invitation: ICompanyMemberInvitation) {
      return CompanyDb.findByPk(invitation.companyId);
    },
  },
};
