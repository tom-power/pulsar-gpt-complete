const GptComplete = require('../lib/lib/gpt-complete');
const dedent = require('dedent-js');

const gptComplete = new GptComplete("testKey");

const testRole = {
  name: "testName",
  description: "testDescription",
  expecting: "testExpecting"
}

function expectedContent(outputRequest) {
  return `###
          Role name: testName
          testDescription${outputRequest}

          Request: testRequest
          ###
          testExpecting:`
}

function expectedRequest(outputRequest) {
  return {
    model: "gpt-3.5-turbo",
    messages: [{
      role: "user",
      content: dedent(expectedContent(outputRequest))
    }]
  }
}

describe("gpt complete", () => {
  it("should pass correct request to openai", () => {
    spyOn(gptComplete.openai, 'createChatCompletion')

    gptComplete.completionFor("testRequest", testRole, "testGrammar");

    actualRequest = gptComplete.openai.createChatCompletion.calls[0].args[0]

    expect(actualRequest).toEqual(expectedRequest("\nOutput should be in testGrammar"))
  });

  it("shouldn't request an output language when there's a null grammar", () => {
    spyOn(gptComplete.openai, 'createChatCompletion')

    gptComplete.completionFor("testRequest", testRole, "text.plain.null-grammar");

    actualRequest = gptComplete.openai.createChatCompletion.calls[0].args[0]

    expect(actualRequest).toEqual(expectedRequest(""))
  });

  it("shouldn't request an output language when there's no grammar", () => {
    spyOn(gptComplete.openai, 'createChatCompletion')

    gptComplete.completionFor("testRequest", testRole, "");

    actualRequest = gptComplete.openai.createChatCompletion.calls[0].args[0]

    expect(actualRequest).toEqual(expectedRequest(""))
  });
});
