// @flow
import {schema} from 'normalizr';

export const serviceSchema = new schema.Entity('services');
export const serviceListSchema = new schema.Array(serviceSchema);

export const businessSchema = new schema.Entity('businesses', {
  services: [serviceSchema]
});
export const businessListSchema = new schema.Array(businessSchema);

const property = new schema.Entity('properties');
const quote = new schema.Entity('quote');

export const clientSchema = new schema.Entity('clients', {
  properties: [property],
  quotes: [quote],
});
export const clientListSchema = new schema.Array(clientSchema);

const lineItem = new schema.Entity('lineItem');

export const jobSchema = new schema.Entity('jobs', {
  line_items: [lineItem],
});
export const jobListSchema = new schema.Array(jobSchema);

export const visitSchema = new schema.Entity('visits', {
  line_items: [lineItem],
});
export const visitListSchema = new schema.Array(visitSchema);
