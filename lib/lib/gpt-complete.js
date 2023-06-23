const {
  Configuration,
  OpenAIApi
} = require("openai");
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

  completionFor(request, role) {
    return this.openai.createChatCompletion(this.requestFor(request, role))
  }

  requestFor(request, role) {
    return {
      model: this.model,
      messages: [{
        role: "user",
        content: dedent(GptComplete.promptFor(request, role))
      }]
    }
  }

  static promptFor(request, role) {
    return `###
            Role name: ${role.name}
            ${role.description}

            Request: ${request}
            ###
            ${role.expecting}:`
  }
}

module.exports = GptComplete
