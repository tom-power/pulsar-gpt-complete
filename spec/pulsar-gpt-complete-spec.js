const {
  getPulsarGptComplete
} = require('../lib/lib/pulsar-gpt-complete');

const pulsarGptComplete = getPulsarGptComplete()

describe("pulsar gpt complete", () => {
  beforeEach(async () => {
    pulsarGptComplete.activate()
  })

  afterEach(async () => {
    pulsarGptComplete.deactivate()
  })

  describe("pulsar gpt complete integration", () => {
    let editor = null;
    let editorView = null;

    beforeEach(() => {
      waitsForPromise(() => atom.workspace.open('test.txt'));
      waitsForPromise(() => atom.packages.activatePackage('pulsar-gpt-complete'));

      return runs(() => {
        editor = atom.workspace.getActiveTextEditor();
        editorView = atom.views.getView(editor);
      });
    });

    describe("selection to code", () => {
      it("should generate code from selection", () => {
        expectedPrompt = "// a commented prompt"
        expectedCode = "let generated=code"
        expectedCodeData = {
          data: {
            choices: [{
              message: {
                content: expectedCode
              }
            }]
          }
        };
        spyOn(pulsarGptComplete, 'selectionToCodeCompletion').andReturn(Promise.resolve(expectedCodeData));

        expect(editor.getText()).toBe(expectedPrompt + "\n");

        selectionToCode = atom.commands.dispatch(editorView, "pulsar-gpt-complete:code-from-selection")

        selectionToCode.then(() =>
          expect(editor.getText()).toBe(expectedPrompt + "\n" + expectedCode + "\n")
        );
      });
    });
  });
});
