'use strict';

/**
 * loyalty-link controller. Server API token only (see schema description).
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::loyalty-link.loyalty-link');
