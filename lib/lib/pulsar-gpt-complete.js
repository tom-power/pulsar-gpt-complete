const GptComplete = require('./gpt-complete');
const code = require('./roles/code');
const comment = require('./roles/comment');

class PulsarGptComplete {
  constructor() {
    const config = {
      "apiKey": atom.config.get('pulsar-gpt-complete.openaiApiKey'),
      "outputLanguageFromGrammar": atom.config.get('pulsar-gpt-complete.outputLanguageFromGrammar'),
    }
    this.gptComplete = new GptComplete(config);
  }

  activate() {
    this.editor = atom.workspace.getActiveTextEditor();
    return this;
  }

  deactivate() {

  }

  selectionToCode() {
    this.selectedCompletionUsing(code, this.editor.getGrammar().name)
      .then((completion) => {
        this.editor.moveToEndOfLine();
        this.editor.insertNewline();
        this.editor.insertText(this.contentFor(completion));
      })
      .catch((err) => {
        console.log(err);
      });
  }

  selectionToComment() {
    this.selectedCompletionUsing(comment, "plain text")
      .then((completion) => {
        this.editor.moveLeft();
        this.editor.insertNewline();
        this.editor.moveUp();
        this.editor.insertText(this.contentFor(completion), { select: true });
        this.editor.toggleLineCommentsInSelection()
      })
      .catch((err) => {
        console.log(err);
      });
  }

  selectedCompletionUsing(role, outputGrammar) {
    return this.gptComplete.completionFor(this.editor.getSelectedText(), role, outputGrammar);
  }

  contentFor(completion) {
    return completion.data.choices[0].message.content;
  }
}

const pulsarGptComplete = new PulsarGptComplete();

module.exports = {
  getPulsarGptComplete: () => pulsarGptComplete
};
