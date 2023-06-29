const { Configuration, OpenAIApi } = require("openai");
const dedent = require('dedent-js');

class GptComplete {
  constructor(apiKey) {
    this.openai = GptComplete.getOpenAi(apiKey);
    this.model = "gpt-3.5-turbo"
  }

  static getOpenAi(apiKey) {
    const config = new Configuration({
      apiKey: apiKey
    });
    delete config.baseOptions.headers['User-Agent'];
    return new OpenAIApi(config);
  }

  completionFor(text, role, outputGrammar) {
    const content = contentFor(text, role, outputGrammar)
    const request = requestFor(this.model, content)
    return this.openai.createChatCompletion(request)
  }
}

function contentFor(text, role, outputGrammar) {
  return `###
          Role name: ${role.name}
          ${role.description}${outputRequestFor(outputGrammar)}

          Request: ${text}
          ###
          ${role.expecting}:`
}

const outputRequestFor = (outputGrammar) =>
  (outputGrammar && outputGrammar != 'text.plain.null-grammar')
    ? "\nOutput should be in " + outputGrammar
    : ""

function requestFor(model, content) {
  return {
    model: model,
    messages: [{
      role: "user",
      content: dedent(content)
    }]
  }
}

module.exports = GptComplete
