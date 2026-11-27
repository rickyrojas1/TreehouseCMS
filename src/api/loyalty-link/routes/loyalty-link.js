'use strict';

/**
 * loyalty-link route. Server API token only (see schema description).
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::loyalty-link.loyalty-link');
