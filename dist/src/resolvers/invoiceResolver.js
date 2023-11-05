import { ValidationError } from 'sequelize';
import { Client as ClientDb, Company as CompanyDb, CompanyMember as CompanyMemberDb, Invoice as InvoiceDb, InvoiceItems as InvoiceItemsDb, User as UserDb, } from '../config/dbConfig.js';
import throwCustomError, { ErrorType } from '../util/error-handler.js';
import sendMail from '.././util/emailSender.js';
import { generateInvoicePdf } from '../util/pdfGenerator.js';
export const invoiceResolver = {
    Query: {
        async getInvoiceById(_, args, context) {
            // Check for authorization
            const companyMember = await CompanyMemberDb.findByPk(context.tokenPayload.id);
            // Check for authorization
            if (companyMember.role !== 'Owner') {
                throwCustomError('Forbidden request', ErrorType.FORBIDDEN);
            }
            // Retrieve the invoice by its ID
            const invoice = await InvoiceDb.findByPk(args.id);
            // Check if the invoice was found
            if (!invoice) {
                throwCustomError('No invoice was found', ErrorType.NOT_FOUND);
            }
            return invoice;
        },
        async listInvoicesByCompany(_, args, context) {
            // Check for authorization
            const companyMember = await CompanyMemberDb.findByPk(context.tokenPayload.id);
            if (!companyMember) {
                throwCustomError('Forbidden request', ErrorType.FORBIDDEN);
            }
            const currentPage = args.findProperties.currentPage || 1;
            const itemsPerPage = args.findProperties.itemsPerPage || 10;
            const offset = (currentPage - 1) * itemsPerPage;
            // Retrieve invoices by company ID
            const invoices = await InvoiceDb.findAll({
                where: {
                    companyId: companyMember.companyId,
                    offset,
                    limit: itemsPerPage,
                },
            });
            // Check if any invoices were found
            if (!invoices || invoices.length === 0) {
                throwCustomError('Invoice not found', ErrorType.NOT_FOUND);
            }
            return invoices;
        },
    },
    Invoice: {
        async invoiceItems(parent) {
            return await InvoiceItemsDb.findAll({
                where: {
                    invoiceId: parent.id,
                },
            });
        },
    },
    Mutation: {
        async createInvoice(_, args, context) {
            try {
                const companyMember = await CompanyMemberDb.findByPk(context.tokenPayload.id);
                // Check for authorization
                if (!companyMember) {
                    throwCustomError('Forbidden request', ErrorType.FORBIDDEN);
                }
                const client = await ClientDb.findByPk(args.invoice.clientId);
                if (companyMember.companyId !== client.companyId) {
                    throwCustomError('Client has different companyId', ErrorType.FORBIDDEN);
                }
                return InvoiceDb.create({
                    clientId: args.invoice.clientId,
                    companyId: companyMember.companyId,
                    dueDate: args.invoice.dueDate,
                    status: 'Created',
                });
            }
            catch (err) {
                if (err instanceof ValidationError) {
                    throwCustomError(`${err.message}`, ErrorType.BAD_REQUEST);
                }
                return err;
            }
        },
        async updateInvoice(_, args, context) {
            try {
                const companyMember = await CompanyMemberDb.findByPk(context.tokenPayload.id);
                const invoice = await InvoiceDb.findByPk(args.id);
                if (!invoice) {
                    throwCustomError('Invoice not found', ErrorType.NOT_FOUND);
                }
                // Check for authorization
                if (!companyMember || companyMember.companyId !== invoice.companyId) {
                    throwCustomError('Forbidden request', ErrorType.FORBIDDEN);
                }
                await InvoiceDb.update(args.updatedInvoiceFields, {
                    where: {
                        id: args.id,
                    },
                });
                const updatedInvoice = await InvoiceDb.findByPk(args.id);
                const companyMembers = await CompanyMemberDb.findAll({
                    where: {
                        companyId: updatedInvoice.companyId,
                    },
                });
                for (const companyMember of companyMembers) {
                    const user = await UserDb.findByPk(companyMember.userId);
                    await sendMail(user.email, 'Updated invoice status', `One of the invoice's status has been changed`);
                }
                return updatedInvoice;
            }
            catch (err) {
                if (err instanceof ValidationError) {
                    throwCustomError(`${err.message}`, ErrorType.BAD_REQUEST);
                }
                return err;
            }
        },
        async softDeleteInvoice(_, args, context) {
            const companyMember = await CompanyMemberDb.findByPk(context.tokenPayload.id);
            const invoice = await InvoiceDb.findByPk(args.id);
            if (!invoice) {
                throwCustomError('Invoice not found', ErrorType.NOT_FOUND);
            }
            // Check for authorization
            if (!companyMember || companyMember.companyId !== invoice.companyId) {
                throwCustomError('Forbidden request', ErrorType.FORBIDDEN);
            }
            await InvoiceDb.destroy({
                where: {
                    id: args.id,
                },
            });
            return {
                status: 'success',
                data: 'null',
            };
        },
        async generatePDFByInvoiceId(_, args, context) {
            const companyMember = await CompanyMemberDb.findByPk(context.tokenPayload.id);
            const invoice = await InvoiceDb.findByPk(args.id);
            //Throw error if invoice not found
            if (!invoice) {
                throwCustomError('Invoice not found', ErrorType.NOT_FOUND);
            }
            // Check for authorization
            if (!companyMember || companyMember.companyId !== invoice.companyId) {
                throwCustomError('Forbidden request', ErrorType.FORBIDDEN);
            }
            const client = await ClientDb.findOne({
                where: {
                    id: invoice.clientId,
                },
            });
            const company = await CompanyDb.findByPk(companyMember.companyId);
            const invoiceItems = await InvoiceItemsDb.findAll({
                where: {
                    invoiceId: invoice.id,
                },
            });
            const data = generateInvoicePdf(invoice, client, company, invoiceItems);
            return {
                data,
            };
        },
    },
};
