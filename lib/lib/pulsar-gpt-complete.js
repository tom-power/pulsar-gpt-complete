const GptComplete = require('./gpt-complete');
const code = require('./roles/code');

class PulsarGptComplete {
  constructor() {
    this.gptComplete = new GptComplete(atom.config.get('pulsar-gpt-complete.openaiApiKey'));
  }

  activate() {
    this.editor = atom.workspace.getActiveTextEditor();
    return this;
  }

  deactivate() {

  }

  selectionToCode() {
    this.selectionToCodeCompletion()
      .then((completion) => {
        this.editor.moveToEndOfLine();
        this.editor.insertNewline();
        this.editor.insertText(completion.data.choices[0].message.content);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  selectionToCodeCompletion() {
    return this.gptComplete.completionFor(this.editor.getSelectedText(), code)
  }
}

const pulsarGptComplete = new PulsarGptComplete();

module.exports = {
  getPulsarGptComplete: () => pulsarGptComplete
};
