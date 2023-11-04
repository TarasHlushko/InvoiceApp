import jwt from 'jsonwebtoken';
import { ValidationError } from 'sequelize';
import { CompanyMember as CompanyMemberDb, User as UserDB, } from '../config/dbConfig.js';
import throwCustomError, { ErrorType } from '../util/error-handler.js';
const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
};
const userResolver = {
    Query: {
        async listUsersByCompany(_, args, context) {
            const companyMember = await CompanyMemberDb.findByPk(context.tokenPayload.id);
            if (!companyMember) {
                throwCustomError('Forbidden request', ErrorType.FORBIDDEN);
            }
            const currentPage = args.findProperties.currentPage || 1;
            const itemsPerPage = args.findProperties.itemsPerPage || 10;
            const offset = (currentPage - 1) * itemsPerPage;
            const usersByCompany = await UserDB.findAll({
                include: [
                    {
                        model: CompanyMemberDb,
                        as: 'members',
                        required: true,
                        where: {
                            companyId: companyMember.companyId,
                        },
                    },
                ],
                offset,
                limit: itemsPerPage,
            });
            if (usersByCompany.length === 0) {
                throwCustomError('Users were not found', ErrorType.NOT_FOUND);
            }
            return usersByCompany;
        },
        async getUserById(_, args, context) {
            const foundUser = await UserDB.findByPk(args.id);
            if (!foundUser) {
                throwCustomError('User was not found', ErrorType.NOT_FOUND);
            }
            //Check if user is the owner of profile
            if (context.tokenPayload.id === args.id) {
                return foundUser;
            }
            //Check if user is a coworker of found user
            const searchedCompanyMember = await CompanyMemberDb.findByPk(args.id);
            const loggedCompanyMember = await CompanyMemberDb.findByPk(context.tokenPayload.id);
            if (searchedCompanyMember &&
                loggedCompanyMember &&
                searchedCompanyMember.companyId === loggedCompanyMember.companyId) {
                return {
                    username: foundUser.username,
                    email: foundUser.email,
                    id: foundUser.id,
                };
            }
            throwCustomError('Forbidden request', ErrorType.FORBIDDEN);
        },
    },
    Mutation: {
        async createUser(_, args) {
            try {
                const isUserExist = await UserDB.findOne({
                    where: {
                        email: args.user.email,
                    },
                });
                if (isUserExist) {
                    throwCustomError('Email is already taken', ErrorType.ALREADY_EXISTS);
                }
                return await UserDB.create({
                    email: args.user.email,
                    username: args.user.username,
                    password: args.user.password,
                });
            }
            catch (err) {
                if (err instanceof ValidationError) {
                    throwCustomError(`${err.message}`, ErrorType.BAD_REQUEST);
                }
                return err;
            }
        },
        async login(_, args) {
            const user = await UserDB.findOne({
                where: {
                    email: args.email,
                },
            });
            if (!user) {
                throwCustomError('User not found', ErrorType.NOT_FOUND);
            }
            if (!args.password || args.password.length < 8) {
                throwCustomError('Please provide valid credentials', ErrorType.BAD_USER_INPUT);
            }
            const isPasswordValid = await user.comparePasswords(args.password, user.password);
            if (!user || !isPasswordValid) {
                throwCustomError('Please provide valid credentials', ErrorType.BAD_USER_INPUT);
            }
            const token = signToken(user.id);
            user.password = undefined;
            return {
                token,
                user,
            };
        },
        async updateUser(_, args, context) {
            try {
                const isUserExist = await UserDB.findOne({
                    where: {
                        id: args.id,
                    },
                });
                if (!isUserExist) {
                    throwCustomError('No such user exist', ErrorType.ALREADY_EXISTS);
                }
                if (context.tokenPayload.id !== isUserExist.id) {
                    throwCustomError('Forbidden request', ErrorType.FORBIDDEN);
                }
                if (args.updatedUserFields.email) {
                    let emailIsTaken;
                    if (isUserExist.email !== context.tokenPayload.email) {
                        emailIsTaken = await UserDB.findOne({
                            where: {
                                email: args.updatedUserFields.email,
                            },
                        });
                    }
                    if (emailIsTaken) {
                        throwCustomError('Email is already taken', ErrorType.ALREADY_EXISTS);
                    }
                }
                await UserDB.update(args.updatedUserFields, {
                    where: {
                        id: context.tokenPayload.id,
                    },
                });
                const user = await UserDB.findByPk(context.tokenPayload.id);
                user.password = undefined;
                return user;
            }
            catch (err) {
                if (err instanceof ValidationError) {
                    throwCustomError(`${err.message}`, ErrorType.BAD_REQUEST);
                }
                return err;
            }
        },
        async softDeleteUser(_, args, context) {
            const userToDelete = await UserDB.findByPk(args.id);
            //Check if user exists
            if (!userToDelete) {
                throwCustomError('User was not found', ErrorType.NOT_FOUND);
            }
            //user can delete his own account
            if (userToDelete.id === context.tokenPayload.id) {
                await UserDB.destroy({
                    where: {
                        id: userToDelete.id,
                    },
                });
                return null;
            }
            //company owner can delete user from companyMember
            const userToDeleteCompanyMember = await CompanyMemberDb.findByPk(userToDelete.id);
            const ownerCompanyMember = await CompanyMemberDb.findOne({
                where: {
                    userId: context.tokenPayload.id,
                    companyId: userToDeleteCompanyMember.companyId,
                    role: 'Owner',
                },
            });
            if (ownerCompanyMember) {
                await CompanyMemberDb.destroy({
                    where: {
                        userId: userToDelete.id,
                    },
                });
                return {
                    status: 'success',
                    data: null,
                };
            }
            //Throw error if user has no rights to do actions
            throwCustomError('Forbidden request', ErrorType.FORBIDDEN);
        },
    },
};
export default userResolver;
