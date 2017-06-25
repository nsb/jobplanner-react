// @flow
import {schema} from 'normalizr';

const businessSchema = new schema.Entity('businesses');
export const businessListSchema = new schema.Array(businessSchema);

const property = new schema.Entity('properties');
const quote = new schema.Entity('quote');

export const clientSchema = new schema.Entity('clients', {
  properties: [property],
  quotes: [quote],
});
export const clientListSchema = new schema.Array(clientSchema);

const lineItem = new schema.Entity('lineItem');

const jobSchema = new schema.Entity('jobs', {
  line_items: [lineItem],
});
export const jobListSchema = new schema.Array(jobSchema);
