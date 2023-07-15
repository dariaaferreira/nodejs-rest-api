const fs = require('fs/promises');
const path = require('path');

const contactsPath = path.join(__dirname, './contacts.json');

const listContacts = async () => {
  const data = await fs.readFile(contactsPath);
  return JSON.parse(data);
}

const getContactById = async (contactId) => {
  const contacts = await listContacts();
  const result = contacts.find(contact => contact.id === contactId);
  
  return result || null;
}

const removeContact = async (contactId) => {
  const contacts = await listContacts();
  const index = contacts.findIndex(contact => contact.id === contactId);

  if (index === -1) {
    return null;
  }

  contacts.splice(index, 1);
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));

  return contactId;
}

const addContact = async (body) => {
  const { name, email, phone } = body;
  const contacts = await listContacts();

  const newContact = { id: Date.now().toString(), name, email, phone };
  contacts.push(newContact);

  await fs.writeFile(contactsPath, JSON.stringify(contacts));

  return { ...newContact };
}

const updateContact = async (contactId, body) => {
  const { name, email, phone } = body;

  const contacts = await listContacts();
  const index = contacts.findIndex(contact => contact.id === contactId);

  if(index === -1) {
    return null;
  }
  contacts[index] = { ...contacts[index], name, email, phone };

  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));

  return contacts[index];
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
}
