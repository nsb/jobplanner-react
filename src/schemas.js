import { schema } from 'normalizr'

export const businessSchema = new schema.Entity('businesses');
export const businessListSchema = new schema.Array(businessSchema);
