const { getPulsarGptComplete } = require('./lib/pulsar-gpt-complete');

function activate() {
  atom.commands.add('atom-text-editor', {
    'pulsar-gpt-complete:selection-to-code': () => getPulsarGptComplete().activate().selectionToCode(),
  });
}

module.exports = {
  activate: activate,
};
