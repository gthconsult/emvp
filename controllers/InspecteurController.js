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
const Inspecteur = require("../models/Inspecteur");



// validate Inspecteur ------------------------------------------------------------------------------------
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
    password,
    date,
    validate,
  } = req.body

  await Inspecteur({
    nom: nom,
    prenom: prenom,
    email: email,
    adresses: adresses,
    telephone: telephone,
    postal: postal,
    ville: ville,
    identite: identite,
    metier: metier,
    id: id,
    pays: pays,
    password: password,
    date: date,
    validate: validate,
  }).save();


  async function createPdf(input, output) {
    try {

      const pdfDoc = await PDFDocument.load(await readFile(input));
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
      form.getTextField('passe').setText(password);
      form.getTextField('date').setText(date);

      //form.getCheckBox('Check Box7').check();
      const pdfBytes = await pdfDoc.save();
      await writeFile(output, pdfBytes);


      res.send({
        msg: "Le compte a été activé avec succès, vous pouvez maintenant télécharger un fichier pdf"
      });


    } catch (err) {
      res.send(err)
    }
  }

  copyFile('./inspecteur/output.pdf', `./inspecteur/output-${identite}.pdf`);
  createPdf(`./inspecteur/info-inspecteur.pdf`, `./inspecteur/output-${identite}.pdf`);


}

// display pdf Inspecteur --------------------------------------------------------------------------------------
exports.get = async (req, res, next) => {

  const {
    identite
  } = req.params

  // display File 
  fs.readFile(`./inspecteur/output-${identite}.pdf`, function (err, data) {
    res.contentType("application/pdf");
    res.send(data);
  });


}

// remove file Inspecteur ---------------------------------------------------------------------------------------
exports.delete = async (req, res, next) => {

  const {
    iid
  } = req.params
  const inspecteur = await Inspecteur.findOne({
    id: iid
  });

  const inspecteurId = await inspecteur._id;

  // delete in MongoDB
  await Inspecteur.findByIdAndRemove(inspecteurId)
    .then(() => {
      fs.unlink(`./inspecteur/output-${inspecteur.identite}.pdf`, (err, data) => {
        if (err && err.code == 'ENOENT') {
          // file doens't exist
          res.send("Le fichier n'existe pas, ne le supprimera pas");
        } else if (err) {
          // other errors, e.g. maybe we don't have enough permission
          res.send("Une erreur s'est produite lors de la tentative de suppression du fichier");
        } else {
          res.send(`La Inspecteur a été supprimé avec succès`);
        }
      });
    })
    .catch((err) => {
      res.send(err);
    });

}


// edit file Inspecteur ---------------------------------------------------------------------------------------
exports.edit = async (req, res, next) => {
  // request Get body
  const {
    iid,
    nom,
    prenom,
    email,
    password,
    adresses,
    telephone,
    postal,
    ville,
    identite,
    metier,
    pays,
    date,
  } = await req.body
  // reparing new info inspecteur
  let inspecteurInfo = {
    iid,
    nom,
    prenom,
    email,
    password,
    adresses,
    telephone,
    postal,
    ville,
    identite,
    pays,
    metier,
    date
  }

  // get info inspecteur for id inspecteur in mongo db by iid id pochdb
  const inspecteur = await Inspecteur.findOne({
    id: iid
  });
  // id mongo DB
  const inspecteurId = await inspecteur._id;
  // update info inspecteur with id MongoDB
  const succesUpdateInspecteur = await Inspecteur.findByIdAndUpdate(inspecteurId, {
    $set: inspecteurInfo
  });

  // get info new Inspecteur
  const infoNewInspecteur = await Inspecteur.findById(inspecteurId);

  if (succesUpdateInspecteur) {

    fs.unlink(`./inspecteur/output-${inspecteur.identite}.pdf`, async (err, data) => {
      fs.copyFile('./inspecteur/output.pdf', `./inspecteur/output-${infoNewInspecteur.identite}.pdf`, async (err, result) => {
        if (err) {
          console.log('error', err);
        }
      });
    });

    const input = `./inspecteur/info-inspecteur.pdf`;
    const output = `./inspecteur/output-${infoNewInspecteur.identite}.pdf`
    const pdfDoc = await PDFDocument.load(await readFile(input));
    const fieldNames = pdfDoc
      .getForm()
      .getFields()
      .map((f) => f.getName());
    const form = pdfDoc.getForm();
    form.getTextField('id').setText(`${infoNewInspecteur.id}`);
    form.getTextField('prenom').setText(`${infoNewInspecteur.prenom}`);
    form.getTextField('nom').setText(`${infoNewInspecteur.nom}`);
    form.getTextField('email').setText(`${infoNewInspecteur.email}`);
    form.getTextField('adresses').setText(`${infoNewInspecteur.adresses}`);
    form.getTextField('telephone').setText(`${infoNewInspecteur.telephone}`);
    form.getTextField('postal').setText(`${infoNewInspecteur.postal}`);
    form.getTextField('ville').setText(`${infoNewInspecteur.ville}`);
    form.getTextField('pays').setText(`${infoNewInspecteur.pays}`);
    form.getTextField('identite').setText(`${infoNewInspecteur.identite}`);
    form.getTextField('metier').setText(`${infoNewInspecteur.metier}`);
    form.getTextField('passe').setText(`${infoNewInspecteur.password}`);
    form.getTextField('date').setText(`${infoNewInspecteur.date}`);

    //form.getCheckBox('Check Box7').check();
    const pdfBytes = await pdfDoc.save();
    await writeFile(output, pdfBytes);
    res.send({
      msg: "Le compte a été activé avec succès, vous pouvez maintenant télécharger un fichier pdf"
    });

  }

}