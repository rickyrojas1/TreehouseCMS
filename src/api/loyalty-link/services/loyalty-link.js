'use strict';

/**
 * loyalty-link service. Server API token only (see schema description).
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::loyalty-link.loyalty-link');
