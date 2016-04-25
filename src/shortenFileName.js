const shortenFileName = file => {

  // Shorten the file name
  if (file.length > 30) {
    file = file.substr(file.length - 30)
    file = file.substr(file.indexOf('/'))
    file = '..' + file
  }

  return file
}

export default shortenFileName
