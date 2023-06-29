const GptComplete = require('../lib/lib/gpt-complete');
const dedent = require('dedent-js');

function configWith(outputLanguageFromGrammar = true) {
  return { "apiKey": "testKey", "outputLanguageFromGrammar": outputLanguageFromGrammar }
}

const gptCompleteWith = (config = configWith()) => new GptComplete(config);

const testRole = {
  name: "testName",
  description: "testDescription",
  expecting: "testExpecting"
}

function expectedContent(outputLanguage) {
  return `###
          Role name: testName
          testDescription${outputLanguage}

          Request: testRequest
          ###
          testExpecting:`
}

function expectedRequest(outputLanguage) {
  return {
    model: "gpt-3.5-turbo",
    messages: [{
      role: "user",
      content: dedent(expectedContent(outputLanguage))
    }]
  }
}

describe("gpt complete", () => {
  it("should pass correct request to openai", () => {
    const gptComplete = gptCompleteWith()

    spyOn(gptComplete.openai, 'createChatCompletion')

    gptComplete.completionFor("testRequest", testRole, "testGrammar");

    const actualRequest = gptComplete.openai.createChatCompletion.calls[0].args[0]

    assertRequest(actualRequest, expectedRequest("\nOutput should be in testGrammar"))
  });

  it("shouldn't request an output language when there's a null grammar", () => {
    const gptComplete = gptCompleteWith()

    spyOn(gptComplete.openai, 'createChatCompletion')

    gptComplete.completionFor("testRequest", testRole, "text.plain.null-grammar");

    const actualRequest = gptComplete.openai.createChatCompletion.calls[0].args[0]

    assertRequest(actualRequest, expectedRequest(""))
  });

  it("shouldn't request an output language when there's no grammar", () => {
    const gptComplete = gptCompleteWith()

    spyOn(gptComplete.openai, 'createChatCompletion')

    gptComplete.completionFor("testRequest", testRole, "");

    const actualRequest = gptComplete.openai.createChatCompletion.calls[0].args[0]

    assertRequest(actualRequest, expectedRequest(""))
  });

  it("shouldn't request an output language when outputLanguageFromGrammar is false", () => {
    const gptComplete = gptCompleteWith(false)

    spyOn(gptComplete.openai, 'createChatCompletion')

    gptComplete.completionFor("testRequest", testRole, "testGrammar");

    const actualRequest = gptComplete.openai.createChatCompletion.calls[0].args[0]

    assertRequest(actualRequest, expectedRequest(""))
  });
});


function assertRequest(actualRequest, expectedRequest) {
  expect(actualRequest.model).toEqual(expectedRequest.model)

  const expectedMessage = expectedRequest.messages[0]
  const actualMessage = actualRequest.messages[0]

  expect(actualMessage.role).toEqual(expectedMessage.role)

  String.prototype.normalize = function() {
    return this.replace(/\n+/g, '').replace(/\s\s+/g, '')
  }
  
  expect(actualMessage.content.normalize()).toEqual(expectedMessage.content.normalize())
}
