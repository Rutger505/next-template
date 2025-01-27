// @ts-check

interface ConfigValues {
  APPLICATION_NAME: string;
  IMAGE_REPOSITORY: string;
}

function validateApplicationConfig() {
  const requiredEnvVars: (keyof ConfigValues)[] = [
    "APPLICATION_NAME",
    "IMAGE_REPOSITORY",
  ];

  const envVars = process.env as unknown as ConfigValues;

  const missingEnvVars = requiredEnvVars.filter(
    (envVar) => !envVars[envVar]?.length,
  );

  if (missingEnvVars.length) {
    throw new Error(
      `Missing required environment variables: ${missingEnvVars.join(", ")}`,
    );
  }

  return {
    applicationName: envVars.APPLICATION_NAME,
    imageRepository: envVars.IMAGE_REPOSITORY,
  };
}

/**
 * @param {Object} params
 * @param {Context} params.context
 * @param {Core} params.core
 */
export default async function generateConfig({ context, core }) {
  try {
    const { applicationName, imageRepository } = validateApplicationConfig();

    const isTag = context.ref.startsWith("refs/tags/");
    const tag = isTag ? context.ref.replace("refs/tags/", "") : undefined;

    const config = {
      is_production: isTag ? "true" : "false",
      tag: isTag ? tag : context.sha,
      environment: isTag
        ? "production"
        : `pr-${context.payload.pull_request?.number}`,
      hostname: isTag
        ? process.env.BASE_DOMAIN
        : `${context.sha}.${process.env.BASE_DOMAIN}`,
      certificate_issuer: isTag
        ? "letsencrypt-production"
        : "letsencrypt-staging",
    };

    const outputs = {
      application_name: applicationName,
      environment: config.environment,
      is_production: config.is_production,
      image: `${imageRepository}:${config.tag}`,
      hostname: config.hostname,
      certificate_issuer: config.certificate_issuer,
    };

    Object.entries(outputs).forEach(([key, value]) => {
      core.setOutput(key, value);
      core.info(`${key}: ${value}`);
    });

    return outputs;
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message);
    }
    throw error;
  }
}
