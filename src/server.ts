import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import { getDbPool } from './db';

const app = express();
const port = Number.parseInt(process.env.PORT ?? '3001', 10);
const allowedOrigins = (process.env.ALLOWED_ORIGINS ?? 'http://localhost:3000')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(helmet());
app.use(
  cors({
    origin: allowedOrigins,
  }),
);
app.use(express.json());

app.get('/', (_request, response) => {
  response.json({
    service: 'A.G.E.N.T.S. API',
    status: 'running',
  });
});

app.get('/health', (_request, response) => {
  response.json({
    status: 'ok',
    service: 'greatestpmever-agents-api',
    version: '1.0.0',
  });
});

app.get('/health/db', async (_request, response) => {
  try {
    const [rows] = await getDbPool().execute('SELECT 1 AS ok');
    response.json({ status: 'ok', db: rows });
  } catch (error) {
    console.error('Database health check failed', error);
    response.status(500).json({ status: 'error' });
  }
});

const domainStatuses = ['DEFINED', 'PARTIAL', 'UNCLEAR'] as const;
const results = ['GO', 'GO_WITH_CONDITIONS', 'NO_GO'] as const;

type DomainStatus = (typeof domainStatuses)[number];
type AssessmentResult = (typeof results)[number];

type AssessmentRequest = {
  assessmentId: string;
  campaign: string | null;
  agentName: string | null;
  agentDescription: string | null;
  result: AssessmentResult;
  authority: DomainStatus;
  guardrails: DomainStatus;
  evidence: DomainStatus;
  network: DomainStatus;
  transfer: DomainStatus;
  success: DomainStatus;
};

function isAssessmentRequest(value: unknown): value is AssessmentRequest {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const body = value as Record<string, unknown>;
  const nullableStrings = ['campaign', 'agentName', 'agentDescription'];
  const requiredStrings = ['assessmentId'];
  const statusFields = ['authority', 'guardrails', 'evidence', 'network', 'transfer', 'success'];

  return (
    requiredStrings.every((field) => typeof body[field] === 'string' && body[field] !== '') &&
    nullableStrings.every((field) => body[field] === null || typeof body[field] === 'string') &&
    results.includes(body.result as AssessmentResult) &&
    statusFields.every((field) => domainStatuses.includes(body[field] as DomainStatus))
  );
}

app.post('/assessments', async (request, response) => {
  if (!isAssessmentRequest(request.body)) {
    response.status(400).json({ status: 'error', error: 'invalid_request' });
    return;
  }

  const assessment = request.body;

  try {
    await getDbPool().execute(
      `INSERT INTO assessments (
        assessment_id,
        campaign,
        agent_name,
        agent_description,
        result,
        authority,
        guardrails,
        evidence,
        network,
        transfer,
        success
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        assessment.assessmentId,
        assessment.campaign,
        assessment.agentName,
        assessment.agentDescription,
        assessment.result,
        assessment.authority,
        assessment.guardrails,
        assessment.evidence,
        assessment.network,
        assessment.transfer,
        assessment.success,
      ],
    );

    response.status(201).json({
      status: 'saved',
      assessmentId: assessment.assessmentId,
    });
  } catch (error) {
    console.error('Assessment persistence failed', error);
    response.status(500).json({ status: 'error' });
  }
});

app.use((_request, response) => {
  response.status(404).json({ error: 'not_found' });
});

app.listen(port, () => {
  console.log(`A.G.E.N.T.S. API listening on port ${port}`);
});
