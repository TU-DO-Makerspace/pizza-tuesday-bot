// --- imports
const { getFirestore } = require("firebase-admin/firestore");

// --- helpers
const { priceFormatter } = require("./price-formatter");

const getMenu = async () => {
  try {
    const db = getFirestore();
    const collection = db.collection(process.env.FIRESTORE_MENU_COLLECTION);
    const doc = collection.doc("i7eixbe6fBrliCzYUXGS"); // TODO: load menu based on pizza tuesday

    const response = await doc.get();

    if (response.exists) {
      const data = response.data();
      return data;
    }

    return false;
  } catch (err) {
    throw err;
  }
};

const generateMenuString = (options) => {
  let menu = "";
  options.map((value, index) => {
    menu += `*__${index + 1}: ${value.title}__*\n`;
    menu += `_${value.description}_\n`;
    menu += `Spendenbeispiel: ${priceFormatter
      .format(value.price)
      .replace(".", ",")}\n\n`;
  });

  return menu;
};

module.exports = { getMenu, generateMenuString };
