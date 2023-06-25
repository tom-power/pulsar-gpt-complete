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

  completionFor(text, role) {
    return this.openai.createChatCompletion(this.requestFor(text, role))
  }

  requestFor(text, role) {
    return {
      model: this.model,
      messages: [{
        role: "user",
        content: dedent(contentFor(text, role))
      }]
    }
  }
}

function contentFor(text, role) {
  return `###
            Role name: ${role.name}
            ${role.description}

            Request: ${text}
            ###
            ${role.expecting}:`
}

module.exports = GptComplete
