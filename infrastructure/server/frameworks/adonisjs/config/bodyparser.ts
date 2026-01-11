import { defineConfig } from "@adonisjs/core/bodyparser";

export default defineConfig({
   
    allowedMethods: ['POST', 'PUT', 'PATCH', 'DELETE'],

    form: {
        encoding: 'utf-8',
        limit: '1mb',
        queryString: {},
        types: ['application/x-www-form-urlencoded'],
    },

    json: {
        encoding: 'utf-8',
        limit: '1mb',
        strict: true,
        types: ['application/json', 'application/json-patch+json', 'application/vnd.api+json', 'application/csp-report'],
    },

    raw: {
        encoding: 'utf-8',
        limit: '1mb',
        types: ['text/*'],
    },

    multipart: {
        autoProcess: true,
        processManually: [],
        encoding: 'utf-8',
        maxFields: 1000,
        limit: '50mb',
        types: ['multipart/form-data'],
  },
})