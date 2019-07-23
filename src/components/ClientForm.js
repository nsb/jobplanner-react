// @flow

import React, { Component } from "react";
import { Field, FieldArray, reduxForm } from "redux-form";
import { injectIntl, intlShape, FormattedMessage } from "react-intl";
import Box from "grommet/components/Box";
import Section from "grommet/components/Section";
import Anchor from "grommet/components/Anchor";
import Button from "grommet/components/Button";
import Header from "grommet/components/Header";
import Heading from "grommet/components/Heading";
import Form from "grommet/components/Form";
import CheckBox from "grommet/components/CheckBox";
import Footer from "grommet/components/Footer";
import FormFields from "grommet/components/FormFields";
import FormField from "grommet/components/FormField";
import CloseIcon from "grommet/components/icons/base/Close";
import BusyIcon from 'grommet/components/icons/Spinning';
import { intlFormFieldRequired, intlFormSavingLabel } from "../i18n";
import type { Client } from "../actions/clients";
import type { Field as CustomField } from "../actions/fields";
import type { Element } from "react";

const intlClientEditTitle = (
  <FormattedMessage
    id="clientForm.editTitle"
    description="Client form edit title"
    defaultMessage="Edit client"
  />
);

const intlClientAddTitle = (
  <FormattedMessage
    id="clientForm.addTitle"
    description="Client form add title"
    defaultMessage="Add client"
  />
);

const intlClientDetailsHeading = (
  <FormattedMessage
    id="clientForm.detailsHeading"
    description="Client form details heading"
    defaultMessage="Client details"
  />
);

const intlFirstName = (
  <FormattedMessage
    id="clientForm.FirstNameLabel"
    description="Client form first name label"
    defaultMessage="First name"
  />
);

const intlLastName = (
  <FormattedMessage
    id="clientForm.LastNameLabel"
    description="Client form last name label"
    defaultMessage="Last name"
  />
);

const intlCompanyName = (
  <FormattedMessage
    id="clientForm.CompanyNameLabel"
    description="Client form company name label"
    defaultMessage="Company name"
  />
)

const intlIsBusiness = (
  <FormattedMessage
    id="clientForm.isBusinessLabel"
    description="Client form is business label"
    defaultMessage="Use company name as the primary name"
  />
)

const intlContactDetailsHeading = (
  <FormattedMessage
    id="clientForm.contactDetailsHeading"
    description="Client form contact details heading"
    defaultMessage="Contact details"
  />
)

const intlPhone = (
  <FormattedMessage
    id="clientForm.phoneLabel"
    description="Client form phone label"
    defaultMessage="Phone"
  />
)

const intlEmail = (
  <FormattedMessage
    id="clientForm.emailLabel"
    description="Client form email label"
    defaultMessage="E-mail"
  />
)

const intlNotificationsHeading = (
  <FormattedMessage
    id="clientForm.notificationsHeading"
    description="Client form automated notifications heading"
    defaultMessage="Automated notifications"
  />
)

const intlVisitRemindersLabel = (
  <FormattedMessage
    id="clientForm.visitRemindersLabel"
    description="Client form automated notifications visit reminders label"
    defaultMessage="Visit reminders"
  />
)

const intlPropertiesHeading = (
  <FormattedMessage
    id="clientForm.propertiesHeading"
    description="Client form properties heading"
    defaultMessage="Property details"
  />
)

const intlAddress1Label = (
  <FormattedMessage
    id="clientForm.address1Label"
    description="Client form address 1 label"
    defaultMessage="Address 1"
  />
)

const intlAddress2Label = (
  <FormattedMessage
    id="clientForm.address2Label"
    description="Client form address 2 label"
    defaultMessage="Address 2"
  />
)

const intlCityLabel = (
  <FormattedMessage
    id="clientForm.cityLabel"
    description="Client form city label"
    defaultMessage="City"
  />
)

const intlZipCodeLabel = (
  <FormattedMessage
    id="clientForm.zipcodeLabel"
    description="Client form zip code label"
    defaultMessage="Zip Code"
  />
)

const intlAddressUsePropertyLabel = (
  <FormattedMessage
    id="clientForm.addressUsePropertyLabel"
    description="Client form address use property label"
    defaultMessage="Billing address is the same as property address"
  />
)

const validate = (values: Client) => {
  const errors = {};
  const propertiesArrayErrors = [];
  values.properties && values.properties.forEach((property, propertyIndex) => {
    const propertyErrors = {};
    if (!property || !property.address1) {
      propertyErrors.address1 = intlFormFieldRequired;
      propertiesArrayErrors[propertyIndex] = propertyErrors;
    }
  })
  if (propertiesArrayErrors.length) {
    errors.properties = propertiesArrayErrors
  }
  if (!values.is_business && !values.first_name) {
    errors.first_name = intlFormFieldRequired;
  }
  if (!values.is_business && !values.last_name) {
    errors.last_name = intlFormFieldRequired;
  }
  if (values.is_business && !values.business_name) {
    errors.business_name = intlFormFieldRequired
  }
  if (!values.address_use_property && !values.address1) {
    errors.address1 = intlFormFieldRequired
  }
  return errors;
};

const renderField = ({
  input,
  label,
  type,
  meta: { touched, error, warning }
}): Element<*> => (
    <FormField label={label} htmlFor={input.name} error={touched ? error : null}>
      <input {...input} type={type} />
    </FormField>
  );

const renderCheckBox = ({
  input,
  label,
  meta: { touched, error, warning }
}): Element<*> => (
    // <FormField label={label} htmlFor={input.name} error={touched ? error : null}>
    <CheckBox {...input} label={label} checked={!!input.value} />
    // </FormField>
  );

const renderProperties = ({
  fields,
  meta: { error, submitFailed }
}): Element<*> => (
    <Section>
      {fields.map((property, index) => (
        <Box margin={{ bottom: "medium" }}>
          <div key={index}>
            {/* Property #{index + 1}
            <Button icon={<CloseIcon />}
              onClick={() => fields.remove(index)}
              href='#'
              primary={false}
              accent={false}
              plain={true} /> */}
            <Field
              name={`${property}.id`}
              type="hidden"
              component={renderField} />
            <Field
              name={`${property}.address1`}
              type="text"
              component={renderField}
              label={intlAddress1Label}
            />
            <Field
              name={`${property}.address2`}
              type="text"
              component={renderField}
              label={intlAddress2Label}
            />
            <Field
              name={`${property}.city`}
              type="text"
              component={renderField}
              label={intlCityLabel}
            />
            <Field
              name={`${property}.zip_code`}
              type="text"
              component={renderField}
              label={intlZipCodeLabel}
            />
          </div>
        </Box>
      ))}
      {/* <Box>
        <button type="button" onClick={() => fields.push({})}>
          Add Property
        </button>
        {submitFailed && error && <span>{error}</span>}
      </Box> */}
    </Section>
  );

type Props = {
  handleSubmit: Function,
  valid: boolean,
  dirty: boolean,
  submitting: boolean,
  onClose: Function,
  fields: Array<CustomField>,
  initialValues: Object,
  isFetching: boolean
};

type State = {
  address_use_property: boolean
}

class ClientForm extends Component<Props & { intl: intlShape }, State> {

  constructor({ initialValues }: Props) {
    super();
    this.state = { address_use_property: initialValues.address_use_property };
  }

  render() {
    const {
      handleSubmit,
      valid,
      dirty,
      submitting,
      onClose,
      // fields,
      initialValues,
      isFetching,
      intl
    } = this.props;

    let billingAddress;
    if (!this.state.address_use_property) {
      billingAddress = (
        <fieldset>
          <Heading tag="h3">Billing address</Heading>
          <Field
            name="address1"
            type="text"
            component={renderField}
            label={intlAddress1Label}
          />
          <Field
            name="address2"
            type="text"
            component={renderField}
            label={intlAddress2Label}
          />
          <Field
            name="city"
            type="text"
            component={renderField}
            label={intlCityLabel}
          />
          <Field
            name="zip_code"
            type="text"
            component={renderField}
            label={intlZipCodeLabel}
          />
        </fieldset>
      )
    }

    const control = isFetching ? (
      <Box direction="row" align="center"
        pad={{ horizontal: 'medium', between: 'small' }}>
        <BusyIcon /><span className="secondary">{intlFormSavingLabel}</span>
      </Box>
    ) : (
        <Button
          type="submit"
          primary={true}
          label={intl.formatMessage({id: 'form.save'})}
          onClick={valid && dirty && !submitting ? () => true : undefined}
        />
      )

    return (
      <Form onSubmit={handleSubmit}>
        <Header size="large" justify="between" pad="none">
          <Heading tag="h2" margin="none" strong={true}>
            {initialValues && initialValues.id ? intlClientEditTitle : intlClientAddTitle}
          </Heading>
          <Anchor icon={<CloseIcon />} onClick={onClose} a11yTitle="Close" />
        </Header>

        <FormFields>
          <fieldset>
            <Heading tag="h3">{intlClientDetailsHeading}</Heading>
            <Box direction="row">
              <Field
                name="first_name"
                label={intlFirstName}
                component={renderField}
                type="text"
              />
              <Field
                name="last_name"
                label={intlLastName}
                component={renderField}
                type="text"
              />
            </Box>
            <Field
              name="business_name"
              label={intlCompanyName}
              component={renderField}
              type="text"
            />
            <Field
              name="is_business"
              label={intlIsBusiness}
              component={renderCheckBox}
              parse={(value: boolean | string) => !!value}
            />
          </fieldset>

          <fieldset>
            <Heading tag="h3">{intlContactDetailsHeading}</Heading>
            <Field
              name="phone"
              label={intlPhone}
              component={renderField}
              type="text"
            />
            <Field
              name="email"
              label={intlEmail}
              component={renderField}
              type="email"
            />
          </fieldset>

          <fieldset>
            <Heading tag="h3">{intlNotificationsHeading}</Heading>
            <Field
              name="upcoming_visit_reminder_email_enabled"
              label={intlVisitRemindersLabel}
              component={renderCheckBox}
              parse={(value: boolean | string) => !!value}
            />
          </fieldset>

          <fieldset>
            <Heading tag="h3">{intlPropertiesHeading}</Heading>
            <FieldArray
              name="properties"
              label="Properties"
              component={renderProperties}
            />
            <Field
              name="address_use_property"
              label={intlAddressUsePropertyLabel}
              component={renderCheckBox}
              parse={(value: boolean | string) => !!value}
              onChange={(event, value) => { this.setState({ address_use_property: value }) }}
            />
          </fieldset>

          {billingAddress}

          {/* <fieldset>
            <Heading tag="h3">Additional client details</Heading>
            {fields.map((field, index) => (
              <Field
                name={field.name}
                label={field.label}
                component={renderField}
                type={field.type}
              />
            ))}
          </fieldset> */}
        </FormFields>

        <Footer pad={{ vertical: "medium" }}>
          <span />
          {control}
        </Footer>
      </Form>
    );
  }
};

export default reduxForm({
  form: "client", // a unique identifier for this form
  validate
})(injectIntl(ClientForm));
