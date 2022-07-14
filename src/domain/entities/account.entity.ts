/**
 * @class
 * @name Account
 * @description The account subset for workspace ops
 * @author Mark Leung <leungas@gmail.com>
 */
export class Account {
    
    /**
     * @property 
     * @name id
     * @description The ID of the record
     * @type {string}
     */
    id: string;

    /**
     * @property
     * @name createdOn
     * @description The date when record is created
     * @type {Date}
     */
    createdOn?: Date;

    /**
     * @property
     * @name settings
     * @description the internal settings applicable to the apps
     * @type {Map<string, string>}
     */
    settings: Map<string, string> = new Map<string, string>();    
}
