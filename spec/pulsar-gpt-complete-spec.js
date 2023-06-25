const { getPulsarGptComplete } = require('../lib/lib/pulsar-gpt-complete');
const code  = require('../lib/lib/roles/code');
const comment = require('../lib/lib/roles/comment');

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
    const testCode = "const some=code"

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
    };

    it("should generate code from selection", async () => {
      spyOn(pulsarGptComplete.gptComplete, 'completionFor').andReturn(Promise.resolve(completionFor(testCode)));;
      editor.setText(testComment);
      editor.selectAll();
      await atom.commands.dispatch(editorView, "pulsar-gpt-complete:code-from-selection");
      expect(pulsarGptComplete.gptComplete.completionFor).toHaveBeenCalledWith(testComment, code, "JavaScript");
      expect(editor.getText()).toBe(testComment + "\n" + testCode);
    });

    it("should generate comment from selection", async () => {
      spyOn(pulsarGptComplete.gptComplete, 'completionFor').andReturn(Promise.resolve(completionFor(testCommentCompletion)));;
      editor.setText(testCode);
      editor.selectAll();

      await atom.commands.dispatch(editorView, "pulsar-gpt-complete:comment-from-selection");
      expect(pulsarGptComplete.gptComplete.completionFor).toHaveBeenCalledWith(testCode, comment, "plain text");
      expect(editor.getText()).toBe(testComment + "\n" + testCode);
    });
  });
});