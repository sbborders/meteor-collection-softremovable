import SimpleSchema from "simpl-schema";

const af = Package['aldeed:autoform'];
const c2 = Package['aldeed:collection2'];

SimpleSchema.extendOptions(['autoform']);

const defaults = {
  removed: 'removed',
  removedAt: 'removedAt',
  removedBy: 'removedBy',
  restoredAt: 'restoredAt',
  restoredBy: 'restoredBy',
  systemId: '0'
};

// Helper function to safely get userId
function safeGetUserId(fallbackId) {
  try {
    return Meteor.userId();
  } catch (error) {
    return fallbackId || defaults.systemId;
  }
}

// Native JavaScript implementation of _.defaults
function defaults_merge(target, ...sources) {
  const result = { ...target };
  sources.forEach(source => {
    if (source) {
      Object.keys(source).forEach(key => {
        if (result[key] === undefined) {
          result[key] = source[key];
        }
      });
    }
  });
  return result;
}

// Native JavaScript implementation of _.extend
function extend(target, ...sources) {
  sources.forEach(source => {
    if (source) {
      Object.assign(target, source);
    }
  });
  return target;
}

// Native JavaScript implementation of _.isString
function isString(value) {
  return typeof value === 'string';
}

// Native JavaScript implementation of _.clone
function clone(obj) {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj);
  if (Array.isArray(obj)) return obj.slice();
  return { ...obj };
}

const behaviour = function (options) {

  const userId = safeGetUserId();

  if (options == null) { options = {}; }
  check(options, Object);

  const { removed, removedAt, removedBy, restoredAt, restoredBy, systemId } =
    defaults_merge(options, this.options, defaults);

  if (c2 != null) {
    const afDefinition = {
      autoform: {
        omit: true
      }
    };

    const addAfDef = definition => extend(definition, afDefinition);

    const definition = {};

    let def = (definition["removed"] = {
      optional: true,
      type: Boolean
    });

    if (af != null) { addAfDef(def); }

    if (removedAt) {
      def = (definition["removedAt"] = {
        optional: true,
        type: Date
      });

      if (af != null) { addAfDef(def); }
    }

    if (removedBy) {
      def = (definition["removedBy"] = {
        optional: true,
        type: String
      });

      if (af != null) { addAfDef(def); }
    }

    if (restoredAt) {
      def = (definition["restoredAt"] = {
        optional: true,
        type: Date
      });

      if (af != null) { addAfDef(def); }
    }

    if (restoredBy) {
      def = (definition["restoredBy"] = {
        optional: true,
        type: String
      });

      if (af != null) { addAfDef(def); }
    }
    this.collection.attachSchema(new SimpleSchema(definition));
  }

  const beforeFindHook = function (userId, selector, options) {
    if (userId == null) { userId = systemId; }
    if (options == null) { options = {}; }
    if (!selector) { return; }
    if (isString(selector)) {
      selector =
        { _id: selector };
    }

    if (Match.test(selector, Object) && !(options.removed || (selector["removed"] != null))) {
      selector["removed"] = { "$exists": false };
    }
  };

  this.collection.before.find(beforeFindHook);
  this.collection.before.findOne(beforeFindHook);

  const isLocalCollection = this.collection._connection === null;

  this.collection.softRemove = async function (selector, callback) {

    let $set, $unset, ret;
    if (!selector) { return 0; }

    // Use safe userId getter for current context
    const currentUserId = safeGetUserId(systemId);

    const modifier =
    {
      $set: ($set = {}),
      $unset: ($unset = {})
    };

    $set["removed"] = true;
    $set["removedAt"] = new Date;
    $set["removedBy"] = currentUserId;
    $unset["restoredAt"] = true;
    $unset["restoredBy"] = true;

    try {
      if (Meteor.isServer || isLocalCollection) {
        if (this.direct) {
          ret = await this.direct.updateAsync(selector, modifier, { multi: true }, callback);
        } else {
          ret = await this.updateAsync(selector, modifier, { multi: true }, callback);
        }

      } else {
        if (this.direct) {
          ret = await this.direct.updateAsync(selector, modifier, callback);
        } else {
          ret = await this.updateAsync(selector, modifier, callback);
        }
      }

    } catch (error) {
      if (error.reason && error.reason.indexOf('Not permitted.') !== -1) {
        throw new Meteor.Error(403, 'Not permitted. Untrusted code may only ' +
          "softRemove documents by ID."
        );
      }
      throw error;
    }

    if (ret === false) {
      return 0;
    } else {
      return ret;
    }
  };

  return this.collection.restore = async function (selector, callback) {

    let $unset, $set, ret;
    if (!selector) { return 0; }

    // Use safe userId getter for current context
    const currentUserId = safeGetUserId(systemId);

    const modifier =
    {
      $unset: ($unset = {}),
      $set: ($set = {})
    };

    $unset["removed"] = true;
    $unset["removedAt"] = true;
    $unset["removedBy"] = true;
    $set["restoredAt"] = new Date;
    $set["restoredBy"] = currentUserId;

    try {
      if (Meteor.isServer || isLocalCollection) {
        selector = clone(selector);
        selector["removed"] = true;
        if (this.direct) {
          ret = await this.direct.updateAsync(selector, modifier, { multi: true }, callback);
        } else {
          ret = await this.updateAsync(selector, modifier, { multi: true }, callback);
        }

      } else {
        if (this.direct) {
          ret = await this.direct.updateAsync(selector, modifier, callback);
        } else {
          ret = await this.updateAsync(selector, modifier, callback);
        }
      }

    } catch (error) {
      console.log(error);
      if (error.reason && error.reason.indexOf('Not permitted.') !== -1) {
        throw new Meteor.Error(403, 'Not permitted. Untrusted code may only ' +
          "restore documents by ID."
        );
      }
      throw error;
    }

    if (ret === false) {
      return 0;
    } else {
      return ret;
    }
  };
};

CollectionBehaviours.define('softRemovable', behaviour);
