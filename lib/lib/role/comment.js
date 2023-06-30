const { baseRoleDescription, expectingText } = require('./const');

const commentRoleDescription = `Provide only code comments as output without any description.`

const comment = {
  name: "comment",
  description: commentRoleDescription + '\n' + baseRoleDescription,
  expecting: expectingText,
}

module.exports = comment
