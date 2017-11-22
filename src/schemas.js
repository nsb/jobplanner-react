// @flow
import { schema } from "normalizr";

export const employeeSchema = new schema.Entity("employees");
export const employeeListSchema = new schema.Array(employeeSchema);

export const serviceSchema = new schema.Entity("services");
export const serviceListSchema = new schema.Array(serviceSchema);

export const businessSchema = new schema.Entity("businesses", {
  services: [serviceSchema],
  employees: [employeeSchema]
});
export const businessListSchema = new schema.Array(businessSchema);

const property = new schema.Entity("properties");
const quote = new schema.Entity("quote");

export const clientSchema = new schema.Entity("clients", {
  properties: [property],
  quotes: [quote]
});
export const clientListSchema = new schema.Array(clientSchema);

const lineItem = new schema.Entity("lineItems");

export const jobSchema = new schema.Entity("jobs", {
  line_items: [lineItem],
  property: property
});

export const jobSchemaDenormalize = new schema.Entity("jobs", {
  line_items: [lineItem]
});

export const jobListSchema = new schema.Array(jobSchema);

export const visitSchema = new schema.Entity("visits", {
  line_items: [lineItem],
  assigned: [employeeSchema],
  property: property
});
export const visitListSchema = new schema.Array(visitSchema);

export const visitSchemaDenormalize = new schema.Entity("visits", {
  line_items: [lineItem]
});

export const asyncTaskSchema = new schema.Entity("asyncTasks", {});
export const asyncTaskListSchema = new schema.Array(asyncTaskSchema);
