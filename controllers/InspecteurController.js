const {
  readFile,
  writeFile,
  copyFile,
  unlink
} = require('fs/promises');
const path = require("path");
const {
  PDFDocument
} = require('pdf-lib');

const fs = require("fs");




exports.add = async (req, res, next) => {

  const {
    nom,
    prenom,
    email,
    adresses,
    telephone,
    postal,
    ville,
    identite,
    metier,
    id,
    pays,
    passe,
    date
  } = req.body
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
      form.getTextField('metier').setText(metier);
      form.getTextField('passe').setText(passe);
      form.getTextField('date').setText(date);

      //form.getCheckBox('Check Box7').check();

      const pdfBytes = await pdfDoc.save();

      await writeFile(output, pdfBytes);
      res.json({
        msg: "succes"
      }).status(200);
    } catch (err) {
      res.json({
        msg: err
      }).status(400);
    }
  }

  // copyFile('./inspecteur/info-inspecteur.pdf', `./output-inspecteur/info-${identite}.pdf`);
  // copyFile('./inspecteur/output.pdf', `./output-inspecteur/output-${identite}.pdf`);
  copyFile('./inspecteur/output.pdf', `./inspecteur/output-${identite}.pdf`);
  createPdf(`./inspecteur/info-inspecteur.pdf`, `./inspecteur/output-${identite}.pdf`);




}


exports.get = async (req, res, next) => {

  const {
    identite
  } = req.params

    fs.readFile(`./inspecteur/output-${identite}.pdf`, function (err, data) {
      res.contentType("application/pdf");
      res.send(data);
    });


}