// @flow

export type Property = {
  id: number,
  address1: string,
  address2: string,
  city: string,
  zip_code: string,
  country: string
};

export type PropertiesMap = { [id: number]: Property };
