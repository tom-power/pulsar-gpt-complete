# ChatGPT Completions in Pulsar

<p>
  <a href="https://github.com/tom-power/pulsar-gpt-complete/actions/workflows/main.yml">
    <img src="https://img.shields.io/github/actions/workflow/status/tom-power/pulsar-gpt-complete/main.yml?style=flat-square&logo=github&label=CI%20status" alt="actions status">
  </a>
</p>

Simple package for calling OpenAI [completions](https://api.openai.com/v1/chat/completions) in Pulsar.

Roles/prompts borrowed from [ShellGpt](https://github.com/TheR1D/shell_gpt) using `gpt-3.5-turbo`.

# Commands

| Command                                      | Description                                      |
| -------------------------------------------- | ------------------------------------------------ |
| `pulsar-gpt-complete:code from selection`    | complete code from selection, below selection    |
| `pulsar-gpt-complete:code from file`         | complete code from file, at cursor               |
| `pulsar-gpt-complete:comment from selection` | complete comment from selection, above selection |
