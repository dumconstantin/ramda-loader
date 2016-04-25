
const charAt = (text, charNo) => {
  let sub = text.substr(0, charNo)
  return charNo - sub.lastIndexOf('\n')
}

export default charAt
