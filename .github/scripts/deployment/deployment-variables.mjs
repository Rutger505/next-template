// @ts-check

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

export default async function generateDeploymentVr({ core }) {
  try {
    const filteredVars = filterDeploymentConfig(process.env.VARS);
    const filteredSecrets = filterDeploymentConfig(process.env.SECRETS);

    const config = {
      vars: filteredVars,
      secrets: filteredSecrets,
    };

    Object.entries(config).forEach(([key, value]) => {
      core.setOutput(key, value);
      core.info(`${key}: ${JSON.stringify(value)}`);
    });

    return config;
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message);
    }
    throw error;
  }
}
