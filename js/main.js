/***************************************
 * FONCTIONS
 ***************************************/
let onClickAddForm = () => {
  let form = document.querySelector("#contact-form");
  form.reset();   
  form.dataset.mode = "add";
  form.classList.remove("hide");

}

function createContact(title, firstName, lastName, phone) {
  let contact = new Object();
  contact.firstName = firstName;
  contact.lastName = lastName.toUpperCase();
  contact.phone = phone;

  switch (title) {
    case "1":
      contact.title = "Mme.";
      break;

    case "2":
      contact.title = "Mlle.";
      break;

    case "3":
      contact.title = "M.";
      break;
  }

  return contact;
}

function onClickSaveContact(e) {
   e.preventDefault();

  let addressBook = loadAddressBook();
  let contact;

  // Création d'un objet contact avec les données du formulaire.
  contact = createContact(
      document.querySelector("select[name=title]").value,
      document.querySelector("input[name=lastName").value,
      document.querySelector("input[name=firstName]").value,
      document.querySelector("input[name=phone]").value
  );

  if(document.querySelector("#contact-form").dataset.mode == "add") {
    // Mode "ajout", il faut ajouter le contact au carnet d'adresses.
    addressBook.push(contact);
  } else {
    // Mode "édition", il faut modifier un contact existant.
     let index = document.querySelector("#contact-details a").dataset.index;
     addressBook[index] = contact;
  }

  saveAddressBook(addressBook);

   // Mise à jour de l'affichage.
  document.querySelector("#contact-form").classList.add("hide");
  document.querySelector("#contact-details").classList.add("hide");
  refreshAddressBook();
}


function saveAddressBook(addressBook) {
  let jsonDate = JSON.stringify(addressBook);
  window.localStorage.setItem("carnet", jsonDate);
}

function loadAddressBook() {
//Récupération des données dans le localStorage
  let adressBook;
  adressBook = JSON.parse(localStorage.getItem("carnet"));

  
  // Est-ce qu'il n'y avait aucune donnée dans le DOM storage ?
if (adressBook == undefined) {
  // Oui, création d'un carnet d'adresses vide.
  adressBook = new Array();
}
  return adressBook;
}


function refreshAddressBook() {
let addressBook = loadAddressBook();

let liste = "<ul>";

for (let index = 0; index < addressBook.length; index++) {
  liste += `<li><a class="contact" data-index="${index}">${addressBook[index].firstName} ${addressBook[index].lastName}</a><i class="fa fa-trash-o remove"></i></li>`;
}
liste += "</ul>";
document.querySelector("#address-book").innerHTML = liste;
}

function onClickShowContactDetails(elem) {
let addressBook;
let contact;
let index;
/**
 * elem contient la balise qui a déchenché l'événement
 * cette balise contient un data-attribut contenant l'index dans le tableau du contact
 * on accède aux data attributs grâce à la propriété datatset
 */
index = elem.dataset.index;

// Chargement du carnet d'adresses puis récupération du contact sur lequel on a cliqué.
addressBook = loadAddressBook();
contact = addressBook[index];
// console.log(contact);
/*
 * Affichage des données du contact, enregistrement du numéro (index) du contact dans
 * l'attribut HTML data-index de l'hyperlien "Editer ce contact"
 */
document.querySelector("#contact-details h3").textContent =
  contact.title + " " + contact.firstName + " " + contact.lastName;
document.querySelector("#contact-details p").textContent = contact.phone;
document.querySelector("#contact-details a").dataset.index = index;

// Mise à jour de l'affichage.
document.querySelector("#contact-details").classList.remove("hide");
};

function onClickEditContact() {
let addressBook;
let contact;
let index;

/*
 * this = objet DOM qui a déclenché l'évènement,
 *        il s'agit donc de l'hyperlien généré dans onClickShowContactDetails()
 */
index = this.dataset.index;

addressBook = loadAddressBook();
contact = addressBook[index];

document.querySelector("#firstName").value = contact.firstName;
document.querySelector("#lastName").value = contact.lastName;
document.querySelector("#phone").value = contact.phone;

// Sélection de la bonne <option> HTML de la liste déroulante.
switch (contact.title) {
  case "Mme.":
    document.querySelector("#title").value = 1;
    break;

  case "Mlle.":
    document.querySelector("#title").value = 2;
    break;

  case "M.":
    document.querySelector("#title").value = 3;
    break;
}

// Basculement du formulaire en mode édition puis affichage.
document.querySelector("#contact-form").dataset.mode = "edit";
document.querySelector("#contact-form").classList.remove("hide");
}

function onClickClearAddressBook() {
// Sauvegarde d'un carnet d'adresse vide, écrasant le carnet d'adresse existant.
saveAddressBook(new Array());

// Mise à jour de l'affichage.
document.querySelector("#contact-details").classList.add("hide");
refreshAddressBook();
}

function onClickRemoveOneContact(elem) {
let i = elem.dataset.index;
let addressBook = loadAddressBook();
addressBook.splice(i, 1);
saveAddressBook(addressBook);
refreshAddressBook();
}

/***************************************
* EVENT HANDLERS
**************************************/
document.addEventListener("DOMContentLoaded", () => {

  document.querySelector("#add-contact").addEventListener("click", onClickAddForm);
  document.querySelector("#save-contact").addEventListener("click", onClickSaveContact);
  document.querySelector("#contact-details a").addEventListener("click", onClickEditContact);
  document.querySelector("#address-book").addEventListener("click", function (event) {
    console.log(event.target, this, event.target.index);
    if (event.target.classList.contains("contact")) {
      onClickShowContactDetails(event.target);
    } else if (event.target.classList.contains("remove")) {
      onClickRemoveOneContact(event.target);
     // console.log(event.target, this);
    }
  });
  document.querySelector("#clear-address-book").addEventListener("click", onClickClearAddressBook);
});

 
  
