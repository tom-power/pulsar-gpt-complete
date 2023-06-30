const { getPulsarGptComplete } = require('./lib/pulsar-gpt-complete');

function activate() {
  atom.commands.add('atom-text-editor', {
    'pulsar-gpt-complete:code-from-selection': () => getPulsarGptComplete().activate().codeFromSelection(),
    'pulsar-gpt-complete:code-from-file': () => getPulsarGptComplete().activate().codeFromFile(),
    'pulsar-gpt-complete:comment-from-selection': () => getPulsarGptComplete().activate().commentFromSelection(),
  });
}

module.exports = {
  activate: activate,
}
