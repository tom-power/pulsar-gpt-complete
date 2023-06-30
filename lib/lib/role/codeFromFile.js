const code = require('./code');

const codeFromFileRoleDescription =
  (lineNumber) => `Given the request below is code in a file, please provide the next piece of code you'd expect to write in this file at ${lineNumber}.`

const codeFromFile = {
  name: "codeFromFile",
  description: (lineNumber) => codeFromFileRoleDescription(lineNumber) + '\n' + code.description,
  expecting: code.expecting,
}

module.exports = codeFromFile
