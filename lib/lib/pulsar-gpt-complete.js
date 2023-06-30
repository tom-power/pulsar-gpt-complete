const GptComplete = require('./gpt-complete');
const code = require('./role/code');
const codeFromFile = require('./role/codeFromFile');
const comment = require('./role/comment');

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

  codeFromSelection() {
    this.completionUsing(this.editor.getSelectedText(), code, this.editor.getGrammar().name)
      .then((completion) => {
        this.editor.moveToEndOfLine();
        this.editor.insertNewline();
        this.editor.insertText(this.contentFrom(completion));
      })
      .catch((err) => {
        console.log(err);
      });
  }

  codeFromFile() {
    this.completionUsing(this.editor.getText(), codeFromFile, this.editor.getGrammar().name, this.editor.getCursorBufferPosition().row)
      .then((completion) => {        
        this.editor.insertText(this.contentFrom(completion));
      })
      .catch((err) => {
        console.log(err);
      });
  }

  commentFromSelection() {
    this.completionUsing(this.editor.getSelectedText(), comment, "plain text")
      .then((completion) => {
        this.editor.moveLeft();
        this.editor.insertNewline();
        this.editor.moveUp();
        this.editor.insertText(this.contentFrom(completion), { select: true });
        this.editor.toggleLineCommentsInSelection()
      })
      .catch((err) => {
        console.log(err);
      });
  }

  completionUsing(text, role, outputGrammar, lineNumber = null) {
    return this.gptComplete.completionFor(text, role, outputGrammar, lineNumber);
  }

  contentFrom(completion) {
    return completion.data.choices[0].message.content;
  }
}

const pulsarGptComplete = new PulsarGptComplete();

module.exports = {
  getPulsarGptComplete: () => pulsarGptComplete
};
