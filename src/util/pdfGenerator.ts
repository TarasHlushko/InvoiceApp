import PdfDocument from 'pdfkit';
import stream from 'stream';
import { format } from 'date-fns';

const formatDate = (date: string) => {
  const datePart = date.toString().split(' (')[0];

  const inputDate = new Date(datePart);

  const formattedDate = format(inputDate, 'MMMM dd, yyyy');

  return formattedDate;
};

export function generateInvoicePdf(invoice, client, company, invoiceItems) {
  const writableStream = new stream.Writable();
  const chunks = [];

  const pdf = new PdfDocument();

  pdf.pipe(writableStream);

  pdf.fontSize(50).font('Helvetica-Bold').text('tapforce', 50, 10);
  pdf
    .fontSize(25)
    .font('Helvetica')
    .text('INVOICE', 350, 20, { align: 'right' });

  //company info
  pdf
    .fontSize(20)
    .font('Helvetica-Bold')
    .text(company.name, 250, 55, { align: 'right' });
  pdf
    .font('Helvetica')
    .fontSize(16)
    .text(company.street, 300, 95, { align: 'right' });
  pdf.fontSize(16).text(company.buildingNumber, 300, 115, { align: 'right' });
  pdf
    .fontSize(16)
    .text(`${company.region} ${company.zipCode}`, 300, 135, { align: 'right' });
  pdf.fontSize(16).text(company.country, 300, 155, { align: 'right' });
  pdf.moveTo(0, 220).fillColor('grey').lineTo(1080, 220).stroke();

  //customer info
  pdf.fontSize(19).fillColor('grey').text('Bill to', 50, 250);
  pdf.fontSize(16).fillColor('black').text(client.name, 50, 275);

  //invoice info

  pdf
    .fontSize(16)
    .font('Helvetica-Bold')
    .fillColor('black')
    .text('Invoice number:', 230, 250, { align: 'right', width: 200 });
  pdf
    .fontSize(14)
    .font('Helvetica')
    .fillColor('black')
    .text(invoice.id, 450, 240, { width: 150 });
  pdf
    .fontSize(16)
    .font('Helvetica-Bold')
    .fillColor('black')
    .text('Invoice Date:', 230, 290, { align: 'right', width: 200 });

  pdf
    .font('Helvetica')
    .fontSize(16)
    .fillColor('black')
    .text(formatDate(invoice.createdAt), 450, 290, {
      align: 'left',
      width: 200,
    });
  pdf
    .fontSize(16)
    .font('Helvetica-Bold')
    .fillColor('black')
    .text('Payment Due:', 230, 330, { align: 'right', width: 200 });
  pdf
    .font('Helvetica')
    .fontSize(16)
    .fillColor('black')
    .text(formatDate(invoice.dueDate), 450, 330, { align: 'left', width: 200 });

  pdf
    .fillColor('grey')
    .rect(250, 360, 1080, 30)
    .fill('#E0E0E0')
    .stroke()
    .fill('#000000');
  pdf
    .font('Helvetica-Bold')
    .fontSize(16)
    .fillColor('black')
    .text('Amount Due (USD):', 230, 370, { align: 'right', width: 200 });

  const counts = {};
  let finalAmount = 0;
  for (const item of invoiceItems) {
    const description = item.description;
    finalAmount += item.total;
    if (description in counts) {
      counts[description]++;
    } else {
      counts[description] = 1;
    }
  }

  pdf
    .fontSize(16)
    .font('Helvetica-Bold')
    .fillColor('black')
    .text(`$${finalAmount}`, 450, 370, { align: 'left', width: 200 });

  generateInvoiceTable(pdf, invoiceItems, counts);

  pdf.end();

  return new Promise((resolve, reject) => {
    writableStream.on('finish', () => {
      const pdfData = Buffer.concat(chunks);
      const base64PDF = pdfData.toString('base64');
      resolve(base64PDF);
    });

    writableStream.on('error', (error) => {
      reject(error);
    });

    writableStream._write = (chunk, encoding, next) => {
      chunks.push(chunk);
      next();
    };
  });
}

function generateTableRow(doc, y, c1, c2, c3, c4) {
  doc
    .fontSize(16)
    .font('Helvetica-Bold')
    .text(c1, 50, y)
    .font('Helvetica')
    .text(`${c2}`, 280, y, { width: 90, align: 'right' })
    .text(`$${c3}`, 370, y, { width: 90, align: 'right' })
    .text(`$${c4}`, 470, y, { width: 90, align: 'right' });
}

function generateInvoiceTable(doc: PDFKit.PDFDocument, invoiceItems, counts) {
  let i,
    invoiceTableTop = 450;
  let position;
  doc
    .fillColor('grey')
    .rect(0, 410, 1080, 40)
    .fill('#303030')
    .stroke()
    .fill('#000000');
  doc
    .fontSize(16)
    .fill('#FFFFFF')
    .text('Items', 50, 430)
    .text('Quantity', 285, 430, { width: 90, align: 'right' })
    .text('Price', 365, 430, { width: 90, align: 'right' })
    .text('Amount', 470, 430, { width: 95, align: 'right' })
    .fill('#000000');
  let amount = 0;
  for (i = 0; i < invoiceItems.length; i++) {
    const item = invoiceItems[i];
    position = invoiceTableTop + (i + 1) * 30;
    amount += item.total;
    console.log(amount, item.total);
    generateTableRow(
      doc,
      position,
      item.description,
      counts[item.description],
      amount,
      item.total
    );
    doc
      .moveTo(0, position + 15)
      .fillColor('grey')
      .rect(0, position + 15, 1080, 3)
      .fill('#D8D8D8')
      .stroke()
      .fill('#000000');
  }
  doc
    .font('Helvetica-Bold')
    .text('Total:', 280, position + 30, { width: 200, align: 'right' })
    .font('Helvetica')
    .text(`$${amount}`, 525, position + 30, { width: 90 })
    .moveTo(280, position + 55)
    .fillColor('grey')
    .rect(320, position + 55, 1080, 4)
    .fill('#D8D8D8')
    .stroke()
    .fill('#000000');
  doc
    .font('Helvetica-Bold')
    .text('Amount Due (USD):', 280, position + 70, {
      width: 200,
      align: 'right',
    })
    .text(`$${amount}`, 525, position + 70, { width: 90 });
}
