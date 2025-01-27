// @ts-check

/**
 * @typedef {Object} ConfigValues
 * @property {string} APPLICATION_NAME
 * @property {string} IMAGE_REPOSITORY
 */

/**
 * @typedef {import('@actions/github').Context} Context
 * @typedef {typeof core} Core
 */

/**
 * @returns {{ applicationName: string, imageRepository: string }}
 */
function validateApplicationConfig() {
  /** @type {Array<keyof ConfigValues>} */
  const requiredEnvVars = ["APPLICATION_NAME", "IMAGE_REPOSITORY"];

  /** @type {ConfigValues} */
  const envVars = /** @type {any} */ (process.env);

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

    const summary = `
    # Deployment Configuration
    | Parameter | Value |
    | - | - |
    ${Object.entries(outputs)
      .map(([key, value]) => {
        return `| ${key} | ${value} |`;
      })
      .join("\n")}
    `;
    await core.summary.addRaw(summary).addBreak().write();

    return outputs;
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message);
    }
    throw error;
  }
}
