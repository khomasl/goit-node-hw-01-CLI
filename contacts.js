const fs = require('fs/promises')
const contactsPath = require('path')
const crypto = require('crypto') //метод для шифрования и генерации id

const readContent = async () => {
  const content = await fs.readFile(
    contactsPath.join(__dirname, 'db', 'contacts.json'),
    'utf8',
  )
  try {
    return JSON.parse(content)
  } catch (err) {
    console.error(err.message)
    process.exit(1)
  }
}

const writeContent = async (contacts) =>
  await fs.writeFile(
    contactsPath.join(__dirname, 'db', 'contacts.json'),
    JSON.stringify(contacts, null, 2),
  )

const listContacts = async () => {
  return await readContent()
}

const getContactById = async (contactId) => {
  const contacts = await readContent()
  const contact = contacts.find((contact) => contact.id === contactId)
  return contact
}

const removeContact = async (contactId) => {
  const contacts = await readContent()
  const id = contacts.findIndex((contact) => contact.id === contactId)
  if (id === -1) return
  const contact = contacts.splice(id, 1)
  await writeContent(contacts)
  return contact
}

const addContact = async (name, email, phone) => {
  const contacts = await readContent()
  const newContact = { name, email, phone, id: crypto.randomUUID() }
  contacts.push(newContact)
  await writeContent(contacts)
  return newContact
}

module.exports = { listContacts, getContactById, removeContact, addContact }
