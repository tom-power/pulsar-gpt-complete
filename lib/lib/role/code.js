const { baseRoleDescription, expectingCode } = require('./const');

const codeRoleDescription = `Provide only code as output without any description.`

const code = {
  name: "code",
  description: codeRoleDescription + '\n' + baseRoleDescription,
  expecting: expectingCode,
}

module.exports = code
