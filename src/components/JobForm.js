// @flow

import React, { Component } from "react";
import { connect } from "react-redux";
import { Field, FieldArray, formValueSelector, reduxForm } from "redux-form";
import { injectIntl, intlShape, FormattedMessage } from "react-intl";
import moment from "moment";
import Box from "grommet/components/Box";
import Anchor from "grommet/components/Anchor";
import Button from "grommet/components/Button";
import Header from "grommet/components/Header";
import Heading from "grommet/components/Heading";
import Form from "grommet/components/Form";
import Footer from "grommet/components/Footer";
import FormFields from "grommet/components/FormFields";
import FormField from "grommet/components/FormField";
import CheckBox from "grommet/components/CheckBox";
import Select from "grommet/components/Select";
import DateTime from "grommet/components/DateTime";
import Tabs from "grommet/components/Tabs";
import Tab from "grommet/components/Tab";
import CloseIcon from "grommet/components/icons/base/Close";
import EditIcon from "grommet/components/icons/base/Edit";
import BusyIcon from "grommet/components/icons/Spinning";
import JobScheduleEdit from "./JobScheduleEdit";
import ScheduleInput from "./ScheduleInput";
import LineItemsFormContainer from "./JobLineItemsFormContainer";
import PropertySelectContainer from "./PropertySelectContainer";
import { AuthContext } from "../providers/authProvider";
import { intlFormFieldRequired, intlFormSavingLabel } from "../i18n";
import { RRule, rrulestr } from "rrule";
import type { Business } from "../actions/businesses";
import type { Client } from "../actions/clients";
import type { Property } from "../actions/properties";
import type { Dispatch } from "../types/Store";
import type { Schedule } from "../types/Schedule";
import type { Element } from "react";
import type { Employee } from "../actions/employees";
import type { LineItem } from "../actions/lineitems";
import Notification from "grommet/components/Notification";

const intlJobFormTitleEdit = (name: string) => (
  <FormattedMessage
    id="jobForm.titleEdit"
    description="Job form edit title"
    defaultMessage="Job for {name}"
    values={{ name }}
  />
);

const intlJobFormTitleAdd = (
  <FormattedMessage
    id="jobForm.titleAdd"
    description="Job form add title"
    defaultMessage="Add job"
  />
);

const intlJobFormClientHeading = (
  <FormattedMessage
    id="jobForm.clientHeading"
    description="Job form client heading"
    defaultMessage="Client"
  />
);

const intlJobFormDetailsHeading = (
  <FormattedMessage
    id="jobForm.detailsHeading"
    description="Job form details heading"
    defaultMessage="Details"
  />
);

const intlJobFormDetailsTitle = (
  <FormattedMessage
    id="jobForm.detailsTitle"
    description="Job form details title"
    defaultMessage="Title"
  />
);

const intlJobFormDetailsInstructions = (
  <FormattedMessage
    id="jobForm.detailsInstructions"
    description="Job form details instructions"
    defaultMessage="Instructions"
  />
);

const intlJobFormScheduleTabOneOff = (
  <FormattedMessage
    id="jobForm.scheduleTabOneOff"
    description="Job form schedule tab one off"
    defaultMessage="One-Off job"
  />
);

const intlJobFormScheduleTabRecurring = (
  <FormattedMessage
    id="jobForm.scheduleTabRecurring"
    description="Job form schedule tab recurring"
    defaultMessage="Recurring job"
  />
);

const intlJobFormScheduleHeading = (
  <FormattedMessage
    id="jobForm.scheduleHeading"
    description="Job form schedule heading"
    defaultMessage="Schedule"
  />
);

const intlJobFormScheduleBegins = (
  <FormattedMessage
    id="jobForm.scheduleBegins"
    description="Job form schedule begins"
    defaultMessage="Begins"
  />
);

const intlJobFormScheduleEnds = (
  <FormattedMessage
    id="jobForm.scheduleEnds"
    description="Job form schedule ends"
    defaultMessage="Ends"
  />
);

const intlJobFormScheduleAnytime = (
  <FormattedMessage
    id="jobForm.scheduleAnytime"
    description="Job form schedule anytime"
    defaultMessage="Anytime"
  />
);

const intlJobFormScheduleNotification = (
  <FormattedMessage
    id="jobForm.scheduleNotification"
    description="Job form schedule notifiaction"
    defaultMessage="Editing this schedule will clear all incomplete visits from this job and new visits will be created using the updated information."
  />
);

const intlJobFormInvoicingHeading = (
  <FormattedMessage
    id="jobForm.invoicingHeading"
    description="Job form invoicing heading"
    defaultMessage="Invoicing"
  />
);

const intlJobFormInvoicingReminderMapNever = ( // eslint-disable-line no-unused-vars
  <FormattedMessage
    id="jobForm.invoicingNever"
    description="Job form invoicing never"
    defaultMessage="As needed - we won't prompt you"
  />
);

const intlJobFormInvoicingReminderMapVisit = ( // eslint-disable-line no-unused-vars
  <FormattedMessage
    id="jobForm.invoicingVisit"
    description="Job form invoicing visit"
    defaultMessage="After each visit"
  />
);

const intlJobFormInvoicingReminderMapClosed = ( // eslint-disable-line no-unused-vars
  <FormattedMessage
    id="jobForm.invoicingClosed"
    description="Job form invoicing closed"
    defaultMessage="When the job is closed"
  />
);

const intlJobFormInvoicingReminderMapMonthly = ( // eslint-disable-line no-unused-vars
  <FormattedMessage
    id="jobForm.invoicingMonthly"
    description="Job form invoicing monthly"
    defaultMessage="Monthly on the last day of the month"
  />
);

const intlJobFormTeamHeading = (
  <FormattedMessage
    id="jobForm.teamHeading"
    description="Job form team heading"
    defaultMessage="Team"
  />
);

const intlJobFormAssignedLabel = (
  <FormattedMessage
    id="jobForm.teamAssignedLabel"
    description="Job form team assigned label"
    defaultMessage="Assigned team members"
  />
);

export const invoicingReminderMap: { [key: string]: string } = {
  never: "jobForm.invoicingNever",
  visit: "jobForm.invoicingVisit",
  closed: "jobForm.invoicingClosed",
  monthly: "jobForm.invoicingMonthly"
};

export const oneoffInvoicingReminderMap: { [key: string]: string } = {
  never: "jobForm.invoicingNever",
  closed: "jobForm.invoicingClosed"
};

const validate = (values: {
  client: Client,
  anytime: boolean,
  begins: Date,
  ends: Date,
  start_time: Date,
  finish_time: Date,
  description: string,
  line_items: Array<LineItem>
}) => {
  const errors = {};
  const lineItemsArrayErrors = [];
  values.line_items &&
    values.line_items.forEach((lineItem, lineItemIndex) => {
      const lineItemErrors = {};
      if (!lineItem || !lineItem.name) {
        lineItemErrors.name = intlFormFieldRequired;
        lineItemsArrayErrors[lineItemIndex] = lineItemErrors;
      }
      if (!lineItem || !lineItem.quantity) {
        lineItemErrors.quantity = intlFormFieldRequired;
        lineItemsArrayErrors[lineItemIndex] = lineItemErrors;
      }
      if (!lineItem || !lineItem.unit_cost) {
        lineItemErrors.unit_cost = intlFormFieldRequired;
        lineItemsArrayErrors[lineItemIndex] = lineItemErrors;
      }
    });
  if (lineItemsArrayErrors.length) {
    errors.line_items = lineItemsArrayErrors;
  }

  if (!values.client) {
    errors.client = intlFormFieldRequired;
  }

  if (!values.begins) {
    errors.begins = intlFormFieldRequired;
  } else {
    if (!moment(values.begins).isValid()) {
      errors.begins = "Invalid";
    }
  }

  if (!values.anytime) {
    if (!values.start_time) {
      errors.start_time = intlFormFieldRequired;
    }
    if (!values.finish_time) {
      errors.finish_time = intlFormFieldRequired;
    }
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

const renderSelect = ({
  input,
  label,
  options,
  multiple,
  meta: { touched, error, warning }
}): Element<*> => {
  return (
    <Select
      {...input}
      placeHolder="None"
      inline={false}
      multiple={multiple}
      value={input.value}
      options={options}
      onChange={input.onChange}
    />
  );
};

const renderCheckBox = ({
  input,
  label,
  meta: { touched, error, warning }
}): Element<*> => (
  <FormField label={label} htmlFor={input.name} error={touched ? error : null}>
    <CheckBox {...input} checked={!!input.value} />
  </FormField>
);

const renderDateTime = ({
  input,
  label,
  dateFormat,
  meta: { touched, error, warning }
}): Element<*> => {
  return (
    <FormField
      label={label}
      htmlFor={input.name}
      error={touched ? error : null}
    >
      <DateTime {...input} format={dateFormat} />
    </FormField>
  );
};

const renderTextArea = ({
  input,
  label,
  type,
  meta: { touched, error, warning }
}): Element<*> => (
  <FormField label={label} htmlFor={input.name} error={touched ? error : null}>
    <textarea rows="5" {...input} type={type} />
  </FormField>
);

const renderSchedule = ({
  input,
  onClick,
  meta: { touched, error, warning }
}): Element<*> => <ScheduleInput {...input} onClick={onClick} />;

type ClientInputProps = {
  label: string,
  value: { label: string },
  onClick?: Function,
  onClientSearch: Function,
  onSelectClient?: Function,
  clients?: Array<Client>,
  error: ?string
};

class ClientInput extends Component<ClientInputProps> {
  render() {
    const {
      value,
      label,
      onClick,
      onClientSearch,
      onSelectClient,
      clients,
      error
    } = this.props;
    return value ? (
      onClick ? (
        <Anchor
          icon={<EditIcon />}
          label={intlJobFormClientHeading}
          href="#"
          reverse={true}
          onClick={onClick}
        >
          {value.label}
        </Anchor>
      ) : (
        <div>
          {value.label}
        </div>
      )
    ) : (
      <FormField label={label} error={error}>
        <Select
          placeHolder="None"
          onSearch={onClientSearch}
          inline={true}
          multiple={false}
          options={clients}
          value="first"
          onChange={onSelectClient}
        />
      </FormField>
    );
  }
}

const renderClient = ({
  input,
  label,
  onClick,
  onClientSearch,
  onSelectClient,
  clients,
  meta: { touched, error, warning }
}: {
  input: Object,
  label: string,
  onClick?: Function,
  onClientSearch: Function,
  onSelectClient: Function,
  clients: Array<Client>,
  meta: { touched: boolean, error: string, warning: string }
}): Element<*> => (
  <ClientInput
    {...input}
    label={label}
    onClick={onClick}
    onClientSearch={onClientSearch}
    onSelectClient={onSelectClient}
    clients={clients}
    error={error}
  />
);

const rruleToSchedule = (rrule): Schedule => {
  return {
    freq: rrule.options.freq,
    interval: rrule.options.interval,
    byweekday: rrule.options.byweekday,
    bymonthday: rrule.options.bymonthday
  };
};

type JobFormProps = {
  business: Business,
  handleSubmit?: Function,
  valid: boolean,
  dirty: boolean,
  submitting: boolean,
  onClose?: Function,
  initialValues: Object,
  // onChange?: Function,
  dispatch: Dispatch,
  change: Function,
  anytime: boolean,
  client: ?{ value: Client, label: string },
  onClientSearch: Function,
  onSelectClient?: Function,
  employees: Array<Employee>,
  isFetching: boolean,
  fetchClients: Function
};

type JobFormState = {
  clientsSearchText: string,
  clients: Array<Client>,
  scheduleLayer: boolean,
  schedule: Schedule,
  visitsWillBeRegenerated: boolean
};

class JobForm extends Component<
  JobFormProps & { intl: intlShape },
  JobFormState
> {
  dateFormat: string;
  timeFormat: string;
  static defaultProps = {
    employees: []
  };
  static contextType = AuthContext;

  constructor(props: JobFormProps & { intl: intlShape }) {
    super(props);

    this.dateFormat = moment()
      .creationData()
      .locale.longDateFormat("L");
    this.timeFormat = moment()
      .creationData()
      .locale.longDateFormat("LT");

    let recurrences = props.initialValues
      ? props.initialValues.recurrences
      : null;
    let rrule = recurrences
      ? rrulestr(recurrences)
      : new RRule({
          freq: RRule.WEEKLY,
          interval: 1,
          byweekday: RRule.MO
        });

    this.state = {
      clientsSearchText: "",
      clients: [],
      scheduleLayer: false,
      schedule: rruleToSchedule(rrule),
      visitsWillBeRegenerated: false
    };
  }

  render() {
    const {
      handleSubmit,
      valid,
      dirty,
      submitting,
      onClose,
      initialValues,
      anytime,
      client,
      employees,
      intl,
      isFetching
    } = this.props;

    let start_time;
    if (!anytime) {
      start_time = (
        <Field
          name="start_time"
          label="Start time"
          component={renderDateTime}
          dateFormat={this.timeFormat}
          // normalize={(value: string) => moment(value, this.timeFormat)}
          onChange={e => this.setState({ visitsWillBeRegenerated: true })}
        />
      );
    }

    let finish_time;
    if (!anytime) {
      finish_time = (
        <Field
          name="finish_time"
          label="Finish time"
          component={renderDateTime}
          dateFormat={this.timeFormat}
          // normalize={(value: string) => moment(value, this.timeFormat)}
          onChange={e => this.setState({ visitsWillBeRegenerated: true })}
        />
      );
    }

    const mappedClients = this.state.clients.map(client => {
      return {
        value: client,
        label: client.is_business
          ? client.business_name
          : `${client.first_name} ${client.last_name}`
      };
    });

    let clientField;
    if (!initialValues.id) {
      clientField = (
        <fieldset>
          <Field
            name="client"
            label={intlJobFormClientHeading}
            component={renderClient}
            onClientSearch={this.onClientSearch}
            onSelectClient={this.onSelectClient}
            onClick={initialValues.id ? null : this.onEditClient}
            clients={mappedClients}
          />
        </fieldset>
      );
    }

    let scheduleNotification;
    if (this.state.visitsWillBeRegenerated) {
      scheduleNotification = (
        <Notification
          message={intlJobFormScheduleNotification}
          status="warning"
          size="small"
        />
      );
    }

    const invoicingReminderOptions: Array<Object> = Object.entries(
      invoicingReminderMap
    ).map(([key, value]) => {
      return { label: intl.formatMessage({ id: value }), value: key };
    });

    const recurringSchedule = (
      <div>
        <fieldset>
          <Heading tag="h3">{intlJobFormScheduleHeading}</Heading>
          <Field
            name="begins"
            label={intlJobFormScheduleBegins}
            component={renderDateTime}
            dateFormat={this.dateFormat}
            normalize={(value: string) =>
              moment(value, this.dateFormat).toDate()
            }
            onChange={this.onChangeSchedule}
          />
          <Field
            name="ends"
            label={intlJobFormScheduleEnds}
            component={renderDateTime}
            dateFormat={this.dateFormat}
            normalize={(value: string) =>
              moment(value, this.dateFormat).toDate()
            }
            onChange={this.onChangeSchedule}
          />
          {start_time}
          {finish_time}
          <Field
            name="anytime"
            label={intlJobFormScheduleAnytime}
            component={renderCheckBox}
            parse={(value: boolean | string) => !!value}
            onChange={this.onChangeSchedule}
          />
        </fieldset>

        {this.renderSchedules()}

        {scheduleNotification}

        <fieldset>
          <Heading tag="h3">{intlJobFormInvoicingHeading}</Heading>
          <Field
            name="invoice_reminder"
            label="When do you want to invoice?"
            component={renderSelect}
            options={invoicingReminderOptions}
            multiple={false}
            normalize={selected => selected.value}
          />
        </fieldset>
      </div>
    );

    const oneoffInvoicingReminderOptions: Array<Object> = Object.entries(
      oneoffInvoicingReminderMap
    ).map(([key, value]) => {
      return { label: intl.formatMessage({ id: value }), value: key };
    });

    const oneoffSchedule = (
      <div>
        <fieldset>
          <Heading tag="h3">{intlJobFormScheduleHeading}</Heading>
          <Field
            name="begins"
            label={intlJobFormScheduleBegins}
            component={renderDateTime}
            dateFormat={this.dateFormat}
            normalize={(value: string) =>
              moment(value, this.dateFormat).toDate()
            }
            onChange={this.onChangeSchedule}
          />
          <Field
            name="ends"
            label={intlJobFormScheduleEnds}
            component={renderDateTime}
            dateFormat={this.dateFormat}
            normalize={(value: string) =>
              moment(value, this.dateFormat).toDate()
            }
            onChange={this.onChangeSchedule}
          />
          {start_time}
          {finish_time}
          <Field
            name="anytime"
            label={intlJobFormScheduleAnytime}
            component={renderCheckBox}
            parse={(value: boolean | string) => !!value}
            onChange={this.onChangeSchedule}
          />
        </fieldset>

        <fieldset>
          <Heading tag="h3">{intlJobFormInvoicingHeading}</Heading>
          <Field
            name="invoice_reminder"
            label="When do you want to invoice?"
            component={renderSelect}
            options={oneoffInvoicingReminderOptions}
            multiple={false}
            normalize={selected => selected.value}
          />
        </fieldset>
      </div>
    );

    const schedule = initialValues.id ? (
      initialValues.recurrences ? (
        recurringSchedule
      ) : (
        oneoffSchedule
      )
    ) : (
      <Tabs
        onActive={(tabIndex: number) => {
          tabIndex ? this.onRecurringTab() : this.onOneoffTab();
        }}
      >
        <Tab title={intlJobFormScheduleTabOneOff}>{oneoffSchedule}</Tab>
        <Tab title={intlJobFormScheduleTabRecurring}>{recurringSchedule}</Tab>
      </Tabs>
    );

    const control = isFetching ? (
      <Box
        direction="row"
        align="center"
        pad={{ horizontal: "medium", between: "small" }}
      >
        <BusyIcon />
        <span className="secondary">{intlFormSavingLabel}</span>
      </Box>
    ) : (
      <Button
        type="submit"
        primary={true}
        label={intl.formatMessage({ id: "form.save" })}
        onClick={valid && dirty && !submitting ? () => true : undefined}
      />
    );

    return (
      <Form onSubmit={handleSubmit}>
        <Header size="large" justify="between" pad="none">
          <Heading tag="h3" margin="none" strong={true}>
            {initialValues.id
              ? intlJobFormTitleEdit(
                  `${initialValues.client_firstname} ${initialValues.client_lastname}`
                )
              : intlJobFormTitleAdd}
          </Heading>
          <Anchor icon={<CloseIcon />} onClick={onClose} a11yTitle="Close" />
        </Header>

        <FormFields>
          {clientField}

          {initialValues.id ? (
            <Box margin={{ horizontal: "none", vertical: "small" }}>
            <div>{initialValues.property.value.address1}</div>
            <div>{initialValues.property.value.address2}</div>
            <div>
              {initialValues.property.value.zip_code}{" "}
              {initialValues.property.value.city}
            </div>
            <div>{initialValues.property.value.country}</div>
          </Box>
        ) : (
            <PropertySelectContainer
              client={client && client.value}
              onSelect={this.onSelectProperty}
            />
          )}

          <fieldset>
            <Heading tag="h3">{intlJobFormDetailsHeading}</Heading>
            <Field
              name="title"
              label={intlJobFormDetailsTitle}
              component={renderField}
              type="text"
            />
            <Field
              name="description"
              label={intlJobFormDetailsInstructions}
              component={renderTextArea}
              type="text"
              rows="3"
            />
          </fieldset>

          {schedule}

          <fieldset>
            <Heading tag="h3">{intlJobFormTeamHeading}</Heading>
            <Field
              name="assigned"
              label={intlJobFormAssignedLabel}
              component={renderSelect}
              options={employees
                .filter(employee => employee.is_active)
                .map(employee => {
                  return { value: employee.id, label: employee.username };
                })}
              multiple={true}
              normalize={selected => selected.value}
            />
          </fieldset>

          <fieldset>
            <FieldArray
              name="line_items"
              label="Line items"
              component={LineItemsFormContainer}
            />
          </fieldset>
        </FormFields>

        <Footer pad={{ vertical: "medium" }}>
          <span />
          {control}
        </Footer>
      </Form>
    );
  }

  renderSchedules = () => {
    const { scheduleLayer } = this.state;
    let layer;

    if (scheduleLayer) {
      layer = (
        <JobScheduleEdit
          onClose={this.onScheduleClose}
          onSubmit={this.onScheduleSubmit}
          schedule={this.state.schedule}
        />
      );
    }

    return (
      <fieldset>
        <Field
          name="recurrences"
          label={intlJobFormScheduleHeading}
          component={renderSchedule}
          onClick={this.onScheduleAdd}
          onChange={this.onChangeSchedule}
        />
        {layer}
      </fieldset>
    );
  };

  onChangeSchedule = () => {
    const { initialValues } = this.props;
    if (initialValues.id) this.setState({ visitsWillBeRegenerated: true });
  };

  onSelectClient = (selection: {
    option: { value: Client, label: string },
    value: { value: Client, label: string }
  }) => {
    const { dispatch, change } = this.props;
    dispatch(change("client", selection.option));
  };

  onEditClient = (e: SyntheticMouseEvent<*>) => {
    const { dispatch, change } = this.props;
    this.setState({ clients: [] }, () => dispatch(change("client", null)));
    e.preventDefault();
  };

  onClientSearch = (event: SyntheticInputEvent<HTMLInputElement>) => {
    const { business, fetchClients } = this.props;
    const value = event.target.value;

    if (value) {
      const { getUser } = this.context;
      getUser().then(({ access_token }) => {  
        return fetchClients(access_token, {
          business: business.id,
          search: event.target.value,
          limit: "10"
        })
      }).then(responseClients =>
        this.setState({ clients: responseClients.results })
      );
    } else {
      this.setState({ clients: [] });
    }
  };

  onSearch = (e: SyntheticInputEvent<*>) => {
    const clientsSearchText = e.target.value;
    this.setState({ clientsSearchText });
  };

  onSelectProperty = (selection: { value: Property, label: string } | null) => {
    const { dispatch, change } = this.props;
    dispatch(change("property", selection));
  };

  onScheduleAdd = (e: SyntheticInputEvent<*>) => {
    this.setState({ scheduleLayer: true });
    e.preventDefault();
  };

  onScheduleClose = () => {
    this.setState({ scheduleLayer: false });
  };

  onScheduleSubmit = (schedule: Schedule) => {
    const { dispatch, change, initialValues } = this.props;
    dispatch(change("recurrences", new RRule({ ...schedule }).toString()));
    this.setState({
      scheduleLayer: false,
      visitsWillBeRegenerated: !!initialValues.id,
      schedule
    });
  };

  onRecurringTab = () => {
    const { dispatch, change, intl } = this.props;

    const rrule = new RRule({
      freq: RRule.WEEKLY,
      interval: 1,
      byweekday: RRule.MO
    });
    this.onScheduleSubmit(rruleToSchedule(rrule));
    dispatch(
      change("invoice_reminder", {
        value: "monthly",
        label: intl.formatMessage({ id: invoicingReminderMap["monthly"] })
      })
    );
  };

  onOneoffTab = () => {
    const { dispatch, change, intl } = this.props;

    dispatch(change("recurrences", ""));
    dispatch(
      change("invoice_reminder", {
        value: "closed",
        label: intl.formatMessage({ id: oneoffInvoicingReminderMap["closed"] })
      })
    );
  };
}

let SelectingFormValuesJobForm = reduxForm({
  form: "job", // a unique identifier for this form
  validate
})(injectIntl(JobForm));

// Decorate with connect to read form values
const selector = formValueSelector("job"); // <-- same as form name
SelectingFormValuesJobForm = connect((state): * => {
  // can select values individually
  return selector(state, "anytime", "client");
})(SelectingFormValuesJobForm);

export default SelectingFormValuesJobForm;
