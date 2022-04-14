const { readFile, writeFile } = require('fs/promises');
const { PDFDocument } = require('pdf-lib');
const AWS = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3");
const { DO_SPACES_ENDPOINT, DO_SPACES_KEY, DO_SPACES_SECRET, DO_SPACES_NAME } = require('../config');
const spacesEndpoint = new AWS.Endpoint(DO_SPACES_ENDPOINT);
const s3 = new AWS.S3({ endpoint: spacesEndpoint, accessKeyId: DO_SPACES_KEY, secretAccessKey: DO_SPACES_SECRET });


const upload = multer({
  storage: multerS3({
    s3,
    bucket: DO_SPACES_NAME,
    acl: 'public-read',
    metadata: (req, file, cb) => {
      cb(null, {
        fieldName: file.fieldname,
      });
    },
    key: (request, file, cb) => {
      cb(null, `inspecteur-${Date.now().toString(10).slice(2, 10)}`);
    },
  }),
});



exports.add = async (req, res, next) => {

const { nom, prenom, email, adresses, telephone, postal, ville, identite, metier, id ,pays } = req.body


async function createPdf(input, output) {
  try {
    const pdfDoc = await PDFDocument.load(await readFile(input));

    // Modify doc, fill out the form...
    const fieldNames = pdfDoc
      .getForm()
      .getFields()
      .map((f) => f.getName());

    const form = pdfDoc.getForm();

    form.getTextField('id').setText(id);
    form.getTextField('prenom').setText(prenom);
    form.getTextField('nom').setText(nom);
    form.getTextField('email').setText(email);
    form.getTextField('adresses').setText(adresses);
    form.getTextField('telephone').setText(telephone);
    form.getTextField('postal').setText(postal);
    form.getTextField('ville').setText(ville);
    form.getTextField('pays').setText(pays);
    form.getTextField('identite').setText(identite);
    form.getTextField('metier').setText(metier);

    //form.getCheckBox('Check Box7').check();

    const pdfBytes = await pdfDoc.save();

    await writeFile(output, pdfBytes);
    res.json( { msg : "succes"}).status(200);
  } catch (err) {
    res.json( { msg : "echec"}).status(400);
  }
}

createPdf('info-inspecteur.pdf', 'output.pdf');


}
