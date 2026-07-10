/** Example only — adapt paths in the target repo. Not executable business logic. */
module.exports = {
  forbidden: [
    {
      name: 'domain-no-ink',
      from: { path: '^source/domain' },
      to: { path: 'ink|source/ui|source/services' },
    },
    {
      name: 'ui-no-services',
      from: { path: '^source/ui' },
      to: { path: 'source/services|source/config' },
    },
  ],
};
