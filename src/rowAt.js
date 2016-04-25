
const rowAt = (text, charNo) => {
  let sub = text.substr(0, charNo)
  let rows = sub.split('\n')
  return rows.length
}

export default rowAt
