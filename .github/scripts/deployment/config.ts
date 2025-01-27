import * as core from "@actions/core";
import { Context } from "@actions/github/lib/context";
import fs from "fs";
import path from "path";

type Core = typeof core;

function readEnvFile(): Record<string, string> {
  const envPath = path.join(process.cwd(), "application.env");
  const envContent = fs.readFileSync(envPath, "utf8");
  const envVars: Record<string, string> = {};

  envContent.split("\n").forEach((line) => {
    const [key, value] = line.split("=").map((part) => part.trim());
    if (key && value) {
      envVars[key] = value;
    }
  });

  return envVars;
}

export default async function generateConfig({
  context,
  core,
}: {
  context: Context;
  core: Core;
}) {
  try {
    const isTag = context.ref.startsWith("refs/tags/");
    const tag = isTag ? context.ref.replace("refs/tags/", "") : undefined;

    const config = {
      is_production: isTag ? "true" : "false",
      tag: isTag ? tag! : context.sha,
      environment: isTag
        ? "production"
        : `pr-${context.payload.pull_request?.number}`,
      hostname: isTag
        ? process.env.BASE_DOMAIN!
        : `${context.sha}.${process.env.BASE_DOMAIN}`,
      certificate_issuer: isTag
        ? "letsencrypt-production"
        : "letsencrypt-staging",
    };

    const envVars = readEnvFile();

    const outputs = {
      application_name: envVars.APPLICATION_NAME,
      environment: config.environment,
      is_production: config.is_production,
      image: `${envVars.IMAGE_REPOSITORY}:${config.tag}`,
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
