const { Configuration, OpenAIApi } = require("openai");
const dedent = require('dedent-js');

class GptComplete {
  constructor(config) {
    this.openai = GptComplete.getOpenAi(config.apiKey);
    this.requestFor = new ChatCompletionRequest("gpt-3.5-turbo", config.outputLanguageFromGrammar);    
  }

  static getOpenAi(apiKey) {
    const config = new Configuration({
      apiKey: apiKey
    });
    delete config.baseOptions.headers['User-Agent'];
    return new OpenAIApi(config);
  }

  completionFor(text, role, outputGrammar) {
    return this.openai.createChatCompletion(this.requestFor.invoke(text, role, outputGrammar));
  }
}

class ChatCompletionRequest {
  constructor(model, outputLanguageFromGrammar) {
    this.model = model;
    this.outputLanguageFromGrammar = outputLanguageFromGrammar;
  }
  
  invoke(text, role, grammar) {
    return {
      model: this.model,
      messages: [{
        role: "user",
        content: dedent(this.content(text, role, grammar))
      }]
    }
  }

  content(text, role, grammar) {
    return `###
            Role name: ${role.name}
            ${role.description}${this.outputLanguageFor(grammar)}
  
            Request: ${text}
            ###
            ${role.expecting}:`
  }
  
  outputLanguageFor(grammar) {
    return (this.outputLanguageFromGrammar && grammar && grammar != 'text.plain.null-grammar')
      ? "\nOutput should be in " + grammar
      : ""
  }
}


module.exports = GptComplete
