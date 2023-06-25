const { getPulsarGptComplete } = require('./lib/pulsar-gpt-complete');

function activate() {
  atom.commands.add('atom-text-editor', {
    'pulsar-gpt-complete:code-from-selection': () => getPulsarGptComplete().activate().selectionToCode(),
    'pulsar-gpt-complete:comment-from-selection': () => getPulsarGptComplete().activate().selectionToComment(),
  });
}

module.exports = {
  activate: activate,
};
