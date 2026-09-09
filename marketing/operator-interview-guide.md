# Operator interview guide

Purpose: validate migration demand and safety requirements without collecting
private memory content.

## Screening

1. Which OpenClaw version and operating system do you run?
2. Which memory backend do you use now?
3. Have you changed or considered changing it?
4. How many agents and approximate memory files/records are involved?

Do not request credentials, raw memory, channel IDs, hostnames, or database
archives.

## Workflow

1. What triggered the migration or hesitation?
2. Which step felt most likely to lose data?
3. What evidence would make you trust a cutover?
4. Is record reconciliation, recall comparison, or rollback most important?
5. How long can the Gateway be unavailable?
6. Who can approve backup, cutover, promotion, and retirement?
7. Which source export capabilities exist in your installed plugin?
8. What prevented existing backup or migration tools from solving the problem?

## Product reactions

Show a synthetic report containing:

- source/export/canonical counts;
- scopes and agents;
- redaction count;
- duplicate groups;
- generated files;
- recall before/after;
- exact rollback state.

Ask:

1. Which section would you verify first?
2. What is missing before you would run it?
3. Would a ClawHub Skill, standalone CLI, or native migration provider feel
   most trustworthy?
4. Would you contribute a synthetic schema fixture or anonymized dry-run
   summary?

## Evidence capture

Record only:

- environment categories;
- source/target backend names;
- failure class;
- required safety gate;
- preferred distribution;
- willingness to test.

Aggregate findings; do not quote identifying details without written consent.
