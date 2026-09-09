# Contributing

## Principles

- Fail closed on unknown formats.
- Add a synthetic fixture before adding an adapter branch.
- Never commit real memory, credentials, hostnames, channel IDs, or backups.
- Do not add direct writes to OpenClaw SQLite or opaque database parsers.
- Keep production mutations out of adapters.
- Document sourced facts separately from assumptions.

## Development

The release CLI targets Node.js 22 or newer and uses no runtime dependencies.

```bash
npm test
npm run check
```

## Adapter changes

An adapter pull request should include:

1. source package and tested versions;
2. captured CLI help or documented export contract;
3. minimal synthetic input fixture;
4. expected canonical JSONL;
5. malformed/truncated/secret-bearing test cases;
6. count and source-ID reconciliation behavior;
7. compatibility documentation update.

Do not infer support from a similar-looking schema.

## Documentation changes

Claims about upstream behavior require an official source or reproducible
repository evidence. Avoid unsourced market-size, success-rate, lossless,
zero-downtime, and recall-improvement claims.

## Release process

Follow [`RELEASE_CHECKLIST.md`](RELEASE_CHECKLIST.md). Public repository,
ClawHub, and community publication are separate maintainer approvals.
