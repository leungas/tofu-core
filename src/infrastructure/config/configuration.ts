import { readFileSync } from 'fs';
import * as yaml from 'js-yaml';
import { join } from 'path';

/**
 * @function anonymous
 * @description loading the configuration structure
 * @author Mark Leung <leungas@gmail.com>
 */
export default () => {
  const ENV_APP_CONFIG =
    process.env.ENV_APP_CONFIG || join(__dirname, '/app.config.yaml');
  return yaml.load(readFileSync(ENV_APP_CONFIG, 'utf-8')) as Record<
    string,
    any
  >;
};
