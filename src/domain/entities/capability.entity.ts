/**
 * @class
 * @name Capability
 * @descripion The capability on offer
 * @author Mark Leung <leungas@gmail.com>
 */
export class Capability {
  /**
   * @property
   * @name name
   * @description The name of the parameter
   * @type {string}
   */
  name: string;

  /**
   * @property
   * @name description
   * @description The description for the parameter
   * @type {string}
   */
  description: string;

  /**
   * @property
   * @name system
   * @description Parameter for provisioning as system defaults
   * @type {boolean}
   */
  system = false;

  /**
   * @property
   * @name value
   * @description The default value to provision with
   * @type {string}
   */
  value: string;
}
