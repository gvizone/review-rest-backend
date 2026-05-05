import {
  SecretsManagerClient,
  GetSecretValueCommand,
} from '@aws-sdk/client-secrets-manager';

const client = new SecretsManagerClient({
  region: process.env.AWS_REGION ?? 'us-east-1',
});

export async function getSecret(
  secretName: string,
): Promise<Record<string, any>> {
  const command = new GetSecretValueCommand({ SecretId: secretName });
  const response = await client.send(command);

  if (!response.SecretString) {
    throw new Error(`Secret "${secretName}" está vazio ou é binário`);
  }

  return JSON.parse(response.SecretString) as Record<string, any>;
}
