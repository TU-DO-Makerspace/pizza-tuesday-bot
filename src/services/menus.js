// --- imports
const { getFirestore } = require("firebase-admin/firestore");
// --- helpers
const { priceFormatter } = require("../helpers/price-formatter");

const getMenu = async () => {
  try {
    // define document instance
    const db = getFirestore();
    const collection = db.collection(process.env.FIRESTORE_MENU_COLLECTION);
    const doc = collection.doc("i7eixbe6fBrliCzYUXGS"); // TODO: load menu based on pizza tuesday

    // run query
    const response = await doc.get();

    // menu is found -> return menu
    if (response.exists) {
      const data = response.data();
      return data;
    }

    // no menu found -> return false
    return false;
  } catch (err) {
    throw err;
  }
};

const generateMenuString = (options) => {
  // initialize string
  let menu = "";

  // iterate over options
  options.map((value, index) => {
    // add title
    menu += `*__${index + 1}: ${value.title}__*\n`;

    // add description
    menu += `_${value.description}_\n`;

    // add price
    menu += `Spendenbeispiel: ${priceFormatter
      .format(value.price)
      .replace(".", ",")}\n\n`;
  });

  return menu;
};

module.exports = { getMenu, generateMenuString };
