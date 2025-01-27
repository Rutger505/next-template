// @ts-check

import fs from "fs";
import path from "path";

/**
 * Reads the application.env file and returns its contents as an object
 * @returns {Record<string, string>}
 */
function readEnvFile() {
  const envPath = path.join(process.cwd(), "application.env");
  const envContent = fs.readFileSync(envPath, "utf8");
  const envVars = {};

  envContent.split("\n").forEach((line) => {
    const [key, value] = line.split("=").map((part) => part.trim());
    if (key && value) {
      envVars[key] = value;
    }
  });

  return envVars;
}

/** @param {import('@actions/github-script').AsyncFunctionArguments} AsyncFunctionArguments */
export default function generateConfig({ context, core }) {
  try {
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

    // Read application.env file
    const envVars = readEnvFile();

    // Set outputs
    core.setOutput("application_name", envVars.APPLICATION_NAME);
    core.setOutput("environment", config.environment);
    core.setOutput("is_production", config.is_production);
    core.setOutput("image", `${envVars.IMAGE_REPOSITORY}:${config.tag}`);
    core.setOutput("hostname", config.hostname);
    core.setOutput("certificate_issuer", config.certificate_issuer);

    // Log the configuration
    core.info("Generated configuration:");
    const outputs = {
      application_name: envVars.APPLICATION_NAME,
      environment: config.environment,
      is_production: config.is_production,
      image: `${envVars.IMAGE_REPOSITORY}:${config.tag}`,
      hostname: config.hostname,
      certificate_issuer: config.certificate_issuer,
    };

    core.info(JSON.stringify(outputs, null, 2));

    return outputs;
  } catch (error) {
    core.setFailed(error.message);
    throw error;
  }
}
