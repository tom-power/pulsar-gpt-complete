const { getPulsarGptComplete } = require('../lib/lib/pulsar-gpt-complete');
const code = require('../lib/lib/role/code');
const codeFromFile = require('../lib/lib/role/codeFromFile');
const comment = require('../lib/lib/role/comment');

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
      waitsForPromise(() => atom.workspace.open('test.js'));
      waitsForPromise(() => atom.packages.activatePackage('language-javascript'));
      waitsForPromise(() => atom.packages.activatePackage('pulsar-gpt-complete'));

      return runs(() => {
        editor = atom.workspace.getActiveTextEditor();
        editorView = atom.views.getView(editor);
        editor.selectAll();
        editor.delete();
      });
    });

    const testCommentCompletion = "a comment"
    const testComment = `// ${testCommentCompletion}`
    const testCode = "const some='code'"
    const testCodeNext = "console.log(some)"
    const testCodeEnd = "console.log('end')"

    function completionFor(content) {
      return {
        data: {
          choices: [{
            message: {
              content: content
            }
          }]
        }
      }
    }

    it("should complete code from selection", async () => {
      spyOn(pulsarGptComplete.gptComplete, 'completionFor').andReturn(Promise.resolve(completionFor(testCode)));
      editor.setText(testComment);
      editor.selectAll();
      await atom.commands.dispatch(editorView, "pulsar-gpt-complete:code-from-selection");
      expect(pulsarGptComplete.gptComplete.completionFor).toHaveBeenCalledWith(testComment, code, "JavaScript", null);
      expect(editor.getText()).toBe(`${testComment}\n${testCode}`);
    });

    it("should complete next code from file", async () => {
      spyOn(pulsarGptComplete.gptComplete, 'completionFor').andReturn(Promise.resolve(completionFor(`${testCodeNext}`)));
      const testText = `${testComment}\n${testCode}\n\n${testCodeEnd}`
      editor.insertText(testText);
      editor.moveUp(1);
      await atom.commands.dispatch(editorView, "pulsar-gpt-complete:code-from-file");
      expect(pulsarGptComplete.gptComplete.completionFor).toHaveBeenCalledWith(testText, codeFromFile, "JavaScript", 2);
      expect(editor.getText()).toBe(`${testComment}\n${testCode}\n${testCodeNext}\n${testCodeEnd}`);
    });

    it("should complete comment from selection", async () => {
      spyOn(pulsarGptComplete.gptComplete, 'completionFor').andReturn(Promise.resolve(completionFor(testCommentCompletion)));
      editor.setText(testCode);
      editor.selectAll();

      await atom.commands.dispatch(editorView, "pulsar-gpt-complete:comment-from-selection");
      expect(pulsarGptComplete.gptComplete.completionFor).toHaveBeenCalledWith(testCode, comment, "plain text", null);
      expect(editor.getText()).toBe(`${testComment}\n${testCode}`);
    });
  });
});
