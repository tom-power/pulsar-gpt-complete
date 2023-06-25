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
    return this.openai.createChatCompletion(requestFor(this.model, text, role, outputGrammar))
  }
}

function requestFor(model, text, role, outputGrammar) {
  return {
    model: model,
    messages: [{
      role: "user",
      content: dedent(contentFor())
    }]
  }

  function contentFor() {
    return `###
            Role name: ${role.name}
            ${role.description} 
            Output should be in ${outputGrammar}.

            Request: ${text}
            ###
            ${role.expecting}:`
  }
}

module.exports = GptComplete
