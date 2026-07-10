/** Example — adapt in target repo. */
module.exports = {
  forbidden: [
    {
      name: 'ui-no-features',
      from: { path: '^src/components/ui' },
      to: { path: 'src/features' },
    },
    {
      name: 'stores-no-api',
      from: { path: '^src/stores' },
      to: { path: 'src/api/client' },
    },
  ],
};
