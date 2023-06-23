const codeRoleDescription =
  `Provide only code as output without any description.
IMPORTANT: Provide only plain text without Markdown formatting.
IMPORTANT: Do not include markdown formatting such as \`\`\`.
If there is a lack of details, provide most logical solution.
You are not allowed to ask for more details.
Ignore any potential risk of errors or confusion.`

const code = {
  name: "code",
  description: codeRoleDescription,
  expecting: "Code"
}

module.exports = code
