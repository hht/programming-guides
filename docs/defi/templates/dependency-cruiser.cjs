/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
  forbidden: [
    {
      name: 'domain-is-pure',
      severity: 'error',
      from: { path: '^src/domain/' },
      to: {
        path: '^(react|react-dom|wagmi|viem|@tanstack|zustand|src/features|src/app)',
        pathNot: '^src/domain/',
      },
    },
    {
      name: 'marketing-no-web3',
      severity: 'error',
      from: { path: '^src/marketing/' },
      to: { path: '(^src/chain/|^src/contracts/|^wagmi|^viem|^@rainbow-me)' },
    },
    {
      name: 'ui-is-dumb',
      severity: 'error',
      from: { path: '^src/ui/' },
      to: { path: '^src/(features|domain|contracts|auth)/' },
    },
    {
      name: 'features-no-direct-viem-write',
      comment: 'Features must not call viem write APIs directly; go through contracts/writers',
      severity: 'error',
      from: { path: '^src/features/' },
      to: { path: 'viem/(actions/)?(writeContract|sendTransaction)' },
    },
  ],
  options: {
    tsPreCompilationDeps: true,
    tsConfig: { fileName: 'tsconfig.app.json' },
  },
}
