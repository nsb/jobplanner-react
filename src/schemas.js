import { schema } from 'normalizr'

const businessSchema = new schema.Entity('businesses');
export const businessListSchema = new schema.Array(businessSchema);

const property = new schema.Entity('property')
const quote = new schema.Entity('quote')

const clientSchema = new schema.Entity('clients', {
  properties: [ property ],
  quotes: [ quote ]
})
export const clientListSchema = new schema.Array(clientSchema)
