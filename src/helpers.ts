import { env } from "hono/adapter";

/**
 * A helper function that provides utility methods.
 *
 * @param context - The Hono context object.
 * @returns An object containing helper methods.
 */
export const helpers = (context?: HonoContext) => {
  /**
   * Retrieves the value of an environment variable.
   *
   * @param key - The name of the environment variable to retrieve.
   * @param defaultValue - An optional default value to return if the environment variable is not set.
   * @returns The value of the environment variable, or the default value if the environment variable is not set.
   * @throws Will throw an error if the environment variable is not set and no default value is provided.
   */
  const getEnv = (key: string, defaultValue?: string): string => {
    let value: string | undefined;

    if (context) {
      const _env = env<HonoBindings>(context);
      value = _env[key];
    } else {
      value = process.env[key];
    }

    if (!value && defaultValue === undefined) {
      throw new Error(`[${key}] is required`);
    }

    return value || defaultValue!;
  };

  /**
   * Retrieves an environment variable as an array of strings.
   *
   * @param key - The name of the environment variable to retrieve.
   * @param defaultValue - An optional default value to use if the environment variable is not set.
   * @param separator - The character used to separate the values in the environment variable. Defaults to a comma (",").
   * @returns An array of strings obtained by splitting the environment variable value using the specified separator.
   */
  const getEnvAsArray = (key: string, defaultValue?: string, separator = ","): string[] => {
    return getEnv(key, defaultValue).split(new RegExp(`${separator}\\s*`));
  };

  return {
    getEnv,
    getEnvAsArray,
  };
};
