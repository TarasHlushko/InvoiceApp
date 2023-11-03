import throwCustomError, { ErrorType } from '../util/error-handler.js';
import { ValidationError } from 'sequelize';
import { CompanyMember as CompanyMemberDb, Invoice as InvoiceDb, InvoiceItems as InvoiceItemsDb } from '../config/dbConfig.js';
export const invoiceItemsResolver = {
    Mutation: {
        async createInvoiceItem(_, args, context) {
            console.log('1');
            try {
                const invoice = await InvoiceDb.findByPk(args.invoiceItem.invoiceId);
                if (!invoice) {
                    throwCustomError('Invoice was not found', ErrorType.NOT_FOUND);
                }
                const companyMember = await CompanyMemberDb.findByPk(context.tokenPayload.id);
                if (!companyMember || invoice.companyId !== companyMember.companyId) {
                    throwCustomError('Forbidden request', ErrorType.FORBIDDEN);
                }
                return InvoiceItemsDb.create(args.invoiceItem);
            }
            catch (err) {
                if (err instanceof ValidationError) {
                    throwCustomError(`${err.message}`, ErrorType.BAD_REQUEST);
                }
                return err;
            }
        },
        async updateInvoiceItem(_, args, context) {
            try {
                console.log('2');
                if (!args) {
                    throwCustomError('Bad user input', ErrorType.BAD_USER_INPUT);
                }
                const invoiceItem = await InvoiceItemsDb.findByPk(args.id);
                if (!invoiceItem) {
                    throwCustomError('InvoiceItem was not found', ErrorType.NOT_FOUND);
                }
                // Check for authorization and data existence
                const invoice = await InvoiceDb.findOne({
                    where: {
                        id: invoiceItem.invoiceId,
                    }
                });
                const companyMember = await CompanyMemberDb.findByPk(context.tokenPayload.id);
                if (!companyMember || invoice.companyId !== companyMember.companyId) {
                    throwCustomError('Forbidden request', ErrorType.FORBIDDEN);
                }
                await InvoiceItemsDb.update(args.updatedInvoiceItemFields, {
                    where: {
                        id: args.id,
                    },
                });
                return await InvoiceItemsDb.findByPk(args.id);
            }
            catch (err) {
                if (err instanceof ValidationError) {
                    throwCustomError(`${err.message}`, ErrorType.BAD_REQUEST);
                }
                return err;
            }
        },
        async softDeleteInvoiceItem(_, args, context) {
            const invoiceItem = await InvoiceItemsDb.findByPk(args.id);
            if (!invoiceItem) {
                throwCustomError('InvoiceItem was not found', ErrorType.NOT_FOUND);
            }
            // Check for authorization and data existence
            const invoice = await InvoiceDb.findByPk(invoiceItem.invoiceId);
            const companyMember = await CompanyMemberDb.findByPk(context.tokenPayload.id);
            if (!companyMember || invoice.companyId !== companyMember.companyId) {
                throwCustomError('Forbidden request', ErrorType.FORBIDDEN);
            }
            await InvoiceItemsDb.destroy({
                where: {
                    id: args.id,
                },
            });
            return null;
        },
    },
};
