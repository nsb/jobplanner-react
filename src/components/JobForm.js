// @flow

import React, { Component } from "react";
import { connect } from "react-redux";
import { Field, formValueSelector, reduxForm } from "redux-form";
import moment from "moment";
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
import CloseIcon from "grommet/components/icons/base/Close";
import EditIcon from "grommet/components/icons/base/Edit";
import JobScheduleEdit from "./JobScheduleEdit";
import { RRule, rrulestr } from "rrule";
import clientsApi from "../api";
import type { Client, ClientsResponse } from "../actions/clients";
import type { Dispatch } from "../types/Store";
import type { Element } from "react";

const validate = (values: {
  client: Object,
  anytime: boolean,
  start_time: Date,
  finish_time: Date,
  description: string
}) => {
  const errors = {};
  if (!values.client) {
    errors.client = "Required";
  }

  if (!values.begins) {
    errors.begins = "Required";
  } else {
    if (!moment(values.begins).isValid()) {
      errors.begins = "Invalid";
    }
  }

  if (!values.ends) {
    errors.ends = "Required";
  } else {
    if (!moment(values.ends).isValid()) {
      errors.ends = "Invalid";
    }
  }

  if (!values.anytime) {
    if (!values.start_time) {
      errors.start_time = "Required";
    }
    if (!values.finish_time) {
      errors.finish_time = "Required";
    }
  }
  return errors;
};

const renderField = ({
  input,
  label,
  type,
  meta: { touched, error, warning }
}): Element<*> =>
  <FormField label={label} htmlFor={input.name} error={touched ? error : null}>
    <input {...input} type={type} />
  </FormField>;

const renderCheckBox = ({
  input,
  label,
  meta: { touched, error, warning }
}): Element<*> =>
  <FormField label={label} htmlFor={input.name} error={touched ? error : null}>
    <CheckBox {...input} checked={!!input.value} />
  </FormField>;

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

type ScheduleProps = {
  value: string,
  onClick: Function
};

class ScheduleInput extends Component<ScheduleProps> {
  render() {
    const { value, onClick } = this.props;
    let rule = value ? rrulestr(value) : new RRule({ freq: RRule.WEEKLY });
    return (
      <div>
        <Anchor
          icon={<EditIcon />}
          label="Label"
          href="#"
          reverse={true}
          onClick={onClick}
        >
          <Heading tag="h4">
            Visit frequency
          </Heading>
          {rule.toText()}
        </Anchor>
      </div>
    );
  }

  onChange(e: SyntheticInputEvent<*>) {
    console.log(e);
  }
}

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
  clients?: Array<Client>
};

class ClientInput extends Component<ClientInputProps> {
  render() {
    const {
      value,
      label,
      onClick,
      onClientSearch,
      onSelectClient,
      clients
    } = this.props;
    return value
      ? onClick
        ? <Anchor
            icon={<EditIcon />}
            label="Label"
            href="#"
            reverse={true}
            onClick={onClick}
          >
            <Heading tag="h3">
              Client
            </Heading>
            {value.label}
          </Anchor>
        : <div>
            <Heading tag="h3">
              Client
            </Heading>
            {value.label}
          </div>
      : <FormField label={label}>
          <Select
            placeHolder="None"
            onSearch={onClientSearch}
            inline={true}
            multiple={false}
            options={clients}
            value="first"
            onChange={onSelectClient}
          />
        </FormField>;
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
}): Element<*> =>
  <ClientInput
    {...input}
    label={label}
    onClick={onClick}
    onClientSearch={onClientSearch}
    onSelectClient={onSelectClient}
    clients={clients}
  />;

type JobFormProps = {
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
  onClientSearch: Function,
  onSelectClient?: Function,
  token?: string
};

type JobFormState = {
  clientsSearchText: string,
  clients: Array<Client>,
  scheduleLayer: boolean,
  schedule: {
    freq: number,
    interval: number,
    byweekday: string
  }
};

class JobForm extends Component<JobFormProps, JobFormState> {
  constructor(props: JobFormProps) {
    super(props);

    let recurrences = props.initialValues
      ? props.initialValues.recurrences
      : null;
    let rrule = recurrences
      ? rrulestr(recurrences)
      : new RRule({ freq: RRule.WEEKLY });

    this.state = {
      clientsSearchText: "",
      clients: [],
      scheduleLayer: false,
      schedule: {
        freq: rrule.options.freq,
        interval: rrule.options.interval,
        byweekday: rrule.options.byweekday
      }
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
      anytime
    } = this.props;

    const dateFormat = "M/D/YYYY";
    const timeFormat = "h:mm a";

    let start_time;
    if (!anytime) {
      start_time = (
        <Field
          name="start_time"
          label="Start time"
          component={renderDateTime}
          dateFormat={timeFormat}
          // normalize={(value: string) => moment(value, timeFormat)}
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
          dateFormat={timeFormat}
          // normalize={(value: string) => moment(value, timeFormat)}
        />
      );
    }

    const mappedClients = this.state.clients.map(client => {
      return {
        value: client.id,
        label: `${client.first_name} ${client.last_name}`
      };
    });

    let clientField;
    if (!initialValues.id) {
      clientField = (
        <fieldset>
          <Field
            name="client"
            label="Client"
            component={renderClient}
            onClientSearch={this.onClientSearch}
            onSelectClient={this.onSelectClient}
            onClick={initialValues.id ? null : this.onEditClient}
            clients={mappedClients}
          />
        </fieldset>
      )
    }

    return (
      <Form onSubmit={handleSubmit}>

        <Header size="large" justify="between" pad="none">
          <Heading tag="h3" margin="none" strong={true}>
            {initialValues.id
              ? `Job for ${initialValues.client_firstname} ${initialValues.client_lastname}`
              : "Add Job"}
          </Heading>
          <Anchor icon={<CloseIcon />} onClick={onClose} a11yTitle="Close" />
        </Header>

        <FormFields>

          {clientField}

          <fieldset>

            <Heading tag="h3">Details</Heading>
            <Field
              name="description"
              label="Description"
              component={renderField}
              type="text"
            />

          </fieldset>

          <fieldset>
            <Heading tag="h3">Schedule</Heading>
            <Field
              name="begins"
              label="Begins"
              component={renderDateTime}
              dateFormat={dateFormat}
              normalize={(value: string) => moment(value, dateFormat).toDate()}
            />
            <Field
              name="ends"
              label="Ends"
              component={renderDateTime}
              dateFormat={dateFormat}
              normalize={(value: string) => moment(value, dateFormat).toDate()}
            />
            {start_time}
            {finish_time}
            <Field
              name="anytime"
              label="Anytime"
              component={renderCheckBox}
              parse={(value: boolean | string) => !!value}
            />
          </fieldset>

          {this.renderSchedules()}

        </FormFields>

        <Footer pad={{ vertical: "medium" }}>
          <span />
          <Button
            type="submit"
            primary={true}
            label={initialValues ? "Save" : "Add"}
            onClick={valid && dirty && !submitting ? () => true : undefined}
          />
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
          label="Schedule"
          component={renderSchedule}
          onClick={this.onScheduleAdd}
        />
        {layer}
      </fieldset>
    );
  };

  onSelectClient = (selection: {
    option: { value: number, label: string },
    value: { value: number, label: string }
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
    const { token } = this.props;
    const value = event.target.value;

    if (value && token) {
      clientsApi
        .getAll("clients", token, { search: event.target.value, limit: "10" })
        .then((responseClients: ClientsResponse) => {
          this.setState({ clients: responseClients.results });
        })
        .catch((error: string) => {
          throw error;
        });
    } else {
      this.setState({ clients: [] });
    }
  };

  onSearch = (e: SyntheticInputEvent<*>) => {
    const clientsSearchText = e.target.value;
    this.setState({ clientsSearchText });
  };

  onScheduleAdd = (e: SyntheticInputEvent<*>) => {
    this.setState({ scheduleLayer: true });
    e.preventDefault();
  };

  onScheduleClose = () => {
    this.setState({ scheduleLayer: false });
  };

  onScheduleSubmit = (schedule: {
    freq: number,
    interval: number,
    byweekday: string
  }) => {
    const { dispatch, change } = this.props;
    dispatch(
      change("recurrences", `RRULE:${new RRule({ ...schedule }).toString()}`)
    );
    this.setState({ scheduleLayer: false, schedule });
  };
}

let SelectingFormValuesJobForm = reduxForm({
  form: "job", // a unique identifier for this form
  validate
})(JobForm);

// Decorate with connect to read form values
const selector = formValueSelector("job"); // <-- same as form name
SelectingFormValuesJobForm = connect(state => {
  // can select values individually
  const anytime: boolean = selector(state, "anytime");
  return {
    anytime
  };
})(SelectingFormValuesJobForm);

export default SelectingFormValuesJobForm;
