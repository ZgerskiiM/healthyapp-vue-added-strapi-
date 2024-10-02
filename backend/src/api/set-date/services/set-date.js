'use strict';

/**
 * set-date service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::set-date.set-date');
