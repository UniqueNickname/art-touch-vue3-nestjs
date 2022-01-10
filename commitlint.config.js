module.exports = {
  extends: ['@commitlint/config-conventional'],
  parserPreset: 'conventional-changelog-conventionalcommits',
  formatter: '@commitlint/format',
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',
        'fix',
        'docs',
        'refactor',
        'style',
        'chore',
        'revert',
        'test',
        'build',
      ],
    ],
    'scope-enum': [2, 'always', ['backend', 'client', 'global', 'common']],
    'subject-case': [0],
  },
}
