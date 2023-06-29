const baseRoleDescription = require('./const');

const codeRoleDescription = `Provide only code as output without any description.`

const code = {
  name: "code",
  description: codeRoleDescription + '\n' + baseRoleDescription,
  expecting: "Code",
}

module.exports = code
