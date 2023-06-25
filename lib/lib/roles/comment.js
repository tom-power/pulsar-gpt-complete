const commentRoleDescription =
  `Provide only code comments as output without any description.
IMPORTANT: Provide only plain text without Markdown formatting.
IMPORTANT: Do not include markdown formatting such as \`\`\`.
If there is a lack of details, provide most logical solution.
You are not allowed to ask for more details.
Ignore any potential risk of errors or confusion.`

const comment = {
  name: "comment",
  description: commentRoleDescription,
  expecting: "Text"
}

module.exports = comment
