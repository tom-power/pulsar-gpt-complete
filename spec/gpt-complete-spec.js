const GptComplete = require('../lib/lib/gpt-complete');
const dedent = require('dedent-js');

const gptComplete = new GptComplete("testKey");

describe("gpt complete", () => {
  it("should pass correct request to openai", () => {

    spyOn(gptComplete.openai, 'createChatCompletion')

    const testRole = {
      name: "testName",
      description: "testDescription",
      expecting: "testExpecting"
    }

    gptComplete.completionFor("testRequest", testRole);

    function expectedContent() {
      return `###
              Role name: testName
              testDescription

              Request: testRequest
              ###
              testExpecting:`
    }


    expectedRequest = {
      model: "gpt-3.5-turbo",
      messages: [{
        role: "user",
        content: dedent(expectedContent())
      }]
    }

    actualRequest = gptComplete.openai.createChatCompletion.calls[0].args[0]

    expect(actualRequest.model).toEqual(expectedRequest.model)

    expectedMessage = expectedRequest.messages[0]
    actualMessage = actualRequest.messages[0]

    expect(actualMessage.role).toEqual(expectedMessage.role)
    expect(actualMessage.content).toEqual(expectedMessage.content)
  });
});
