const GptComplete = require('../lib/lib/gpt-complete');
const { expectingText, expectingCode } = require('../lib/lib/role/const');
const dedent = require('dedent-js');

function configWith(outputLanguageFromGrammar = true) {
  return { "apiKey": "testKey", "outputLanguageFromGrammar": outputLanguageFromGrammar }
}

const gptCompleteWith = (config = configWith()) => new GptComplete(config);

const testRole = {
  name: "testName",
  description: "testDescription",
  expecting: expectingCode
}

function expectedRequest(outputLanguage, role = testRole) {
  function content() {
    return `###
          Role name: ${role.name}
          ${role.description}

          Request: testRequest
          ###
          ${role.expecting}${outputLanguage}:`
  }
  return {
    model: "gpt-3.5-turbo",
    messages: [{
      role: "user",
      content: dedent(content())
    }]
  }
}

describe("gpt complete", () => {
  it("should pass correct request to openai", () => {
    const gptComplete = gptCompleteWith()

    spyOn(gptComplete.openai, 'createChatCompletion')

    gptComplete.completionFor("testRequest", testRole, "testGrammar");

    const actualRequest = gptComplete.openai.createChatCompletion.calls[0].args[0]

    assertRequest(actualRequest, expectedRequest(" in testGrammar"))
  });

  describe("output language requests", () => {  
    it("shouldn't request an output language when config.outputLanguageFromGrammar is false", () => {
      const gptComplete = gptCompleteWith(false)
  
      spyOn(gptComplete.openai, 'createChatCompletion')
  
      gptComplete.completionFor("testRequest", testRole, "testGrammar");
  
      const actualRequest = gptComplete.openai.createChatCompletion.calls[0].args[0]
  
      assertRequest(actualRequest, expectedRequest(""))
    });

    [
      'text.plain.null-grammar',
      '',
    ].forEach((grammar) => {
      it(`shouldn't request an output language when grammar is ${grammar}`, () => {
        const gptComplete = gptCompleteWith()
    
        spyOn(gptComplete.openai, 'createChatCompletion')
    
        gptComplete.completionFor("testRequest", testRole, grammar);
    
        const actualRequest = gptComplete.openai.createChatCompletion.calls[0].args[0]
    
        assertRequest(actualRequest, expectedRequest(""))
      });  
    });
  
    it("shouldn't request an output language when expecting text", () => {
      const gptComplete = gptCompleteWith()
  
      spyOn(gptComplete.openai, 'createChatCompletion')
  
      const testTextRole = {
        name: "testName",
        description: "testDescription",
        expecting: expectingText
      }
  
      gptComplete.completionFor("testRequest", testTextRole, "testGrammar");
  
      const actualRequest = gptComplete.openai.createChatCompletion.calls[0].args[0]
  
      assertRequest(actualRequest, expectedRequest("", testTextRole))
    });
  });  
});

function assertRequest(actualRequest, expectedRequest) {
  expect(actualRequest.model).toEqual(expectedRequest.model)

  const expectedMessage = expectedRequest.messages[0]
  const actualMessage = actualRequest.messages[0]

  expect(actualMessage.role).toEqual(expectedMessage.role)

  String.prototype.normalize = function () {
    return this.replace(/\n+/g, '').replace(/\s\s+/g, '')
  }

  expect(actualMessage.content.normalize()).toEqual(expectedMessage.content.normalize())
}
