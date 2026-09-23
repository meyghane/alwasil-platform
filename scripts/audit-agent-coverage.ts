import { runAgents } from '../src/lib/agents/pipeline';
import { registeredSources } from '../src/lib/agents/store';
import { formatAgentReport } from '../src/lib/agents/report';

// Read-only rehearsal: no source fetch, publication, database write or message.
try {
  const report = await runAgents({
    sources: registeredSources,
    fetch: async () => { throw new Error('Network extraction disabled in audit'); },
    save: async () => { throw new Error('Writes disabled in audit'); },
    verifyPublic: async () => false,
    rollback: async () => { throw new Error('Writes disabled in audit'); },
    finish: async () => {},
  });
  console.log(formatAgentReport(report));
  if (report.errors.length) process.exitCode = 1;
} catch {
  console.error('Audit de couverture indisponible ; détails confidentiels masqués.');
  process.exitCode = 1;
}
