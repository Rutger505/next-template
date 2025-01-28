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

function filterDeploymentConfig(jsonObject) {
  const parcedObject = JSON.parse(jsonObject);

  const deploymentValues = Object.entries(parcedObject)
    .filter(([key]) => key.startsWith("DEPLOYMENT_"))
    .map(([key, value]) => {
      const newKey = key.replace("DEPLOYMENT_", "");
      return [newKey, value];
    });

  return Object.fromEntries(deploymentValues);
}

function formatValue(value) {
  if (typeof value === "string") {
    return value;
  }
  if (typeof value === "number") {
    return value.toString();
  }

  return `<pre>${JSON.stringify(value, null, 2).replace(/\n/g, "<br>")}</pre>`;
}

/**
 * @param {Object} params
 * @param {Context} params.context
 * @param {Core} params.core
 */
export default async function generateConfig({ context, core }) {
  try {
    const { applicationName, imageRepository } = validateApplicationConfig();
    const filteredVars = filterDeploymentConfig(process.env.VARS);
    const filteredSecrets = filterDeploymentConfig(process.env.SECRETS);

    const isTag = context.ref.startsWith("refs/tags/");
    const tag = isTag ? context.ref.replace("refs/tags/", "") : undefined;

    const config = {
      vars: filteredVars,
      secrets: filteredSecrets,
      secretsStringified: JSON.stringify(filteredSecrets),
      application_name: applicationName,
      environment: isTag
        ? "production"
        : `pr-${context.payload.pull_request.number}`,
      is_production: isTag ? "true" : "false",
      image: `${imageRepository}:${isTag ? tag : context.sha}`,
      hostname: isTag
        ? process.env.BASE_DOMAIN
        : `${context.sha}.${process.env.BASE_DOMAIN}`,
      certificate_issuer: isTag
        ? "letsencrypt-production"
        : "letsencrypt-staging",
    };

    Object.entries(config).forEach(([key, value]) => {
      core.setOutput(key, value);
      core.info(`${key}: ${formatValue(value)}`);
    });

    const summary = `
# Deployment Configuration 🚀
| Parameter | Value |
| - | - |
${Object.entries(config)
  .map(([key, value]) => {
    return `| ${key} | ${formatValue(value)} |`;
  })
  .join("\n")}
    `;
    await core.summary.addRaw(summary).write();

    return config;
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message);
    }
    throw error;
  }
}
