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
import TextInput from "grommet/components/TextInput";
import Select from "grommet/components/Select";
import DateTime from "grommet/components/DateTime";
import CloseIcon from "grommet/components/icons/base/Close";
import EditIcon from "grommet/components/icons/base/Edit";
import JobScheduleEdit from "./JobScheduleEdit";
import { RRule, rrulestr } from "rrule";
import type { Client } from "../actions/clients";
import type { Dispatch } from "../types/Store";
import type { Element } from "react";

const validate = (values: { client: Object }) => {
  const errors = {};
  if (!values.client) {
    errors.client = "Required";
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

const renderTextInput = ({
  input,
  label,
  meta: { touched, error, warning }
}): Element<*> =>
  <FormField label={label} htmlFor={input.name} error={touched ? error : null}>
    <TextInput {...input} />
  </FormField>;

const renderCheckBox = ({
  input,
  label,
  meta: { touched, error, warning }
}): Element<*> =>
  <FormField label={label} htmlFor={input.name} error={touched ? error : null}>
    <CheckBox {...input} checked={!!input.value} />
  </FormField>;

const normalizeSelect = value => {
  return value.option;
};

const renderSelect = ({
  input,
  label,
  options,
  onSearch,
  meta: { touched, error, warning }
}): Element<*> => {
  return (
    <FormField
      label={label}
      htmlFor={input.name}
      error={touched ? error : null}
    >
      <Select {...input} options={options} onSearch={onSearch} />
    </FormField>
  );
};

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
          <Heading tag="h3">
            Schedule
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
  onClick: Function,
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
    console.log(value);
    return value
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
  clients: Array<Client>
};

type JobFormState = {
  clientsSearchText: string,
  scheduleLayer: boolean,
  schedule: {
    freq: number,
    interval: number,
    byweekday: string
  }
};

class JobForm extends Component<JobFormProps, JobFormState> {
  static defaultProps = {
    clients: []
  };

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
      anytime,
      onClientSearch,
      onSelectClient,
      clients
    } = this.props;

    const dateFormat = anytime ? "M/D/YYYY" : "M/D/YYYY h:mm a";

    const mappedClients = clients.map(client => {
      return {
        value: client.id,
        label: `${client.first_name} ${client.last_name}`
      };
    });

    return (
      <Form onSubmit={handleSubmit}>

        <Header size="large" justify="between" pad="none">
          <Heading tag="h2" margin="none" strong={true}>
            {initialValues.id ? "Edit job" : "Add Job"}
          </Heading>
          <Anchor icon={<CloseIcon />} onClick={onClose} a11yTitle="Close" />
        </Header>

        <FormFields>

          <fieldset>
            <Field
              name="client"
              label="Client"
              component={renderClient}
              onClientSearch={onClientSearch}
              onSelectClient={this.onSelectClient}
              clients={mappedClients}
            />
          </fieldset>

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
            <Field
              name="begins"
              label="Begins"
              component={renderDateTime}
              dateFormat={dateFormat}
              normalize={(value: string) => moment(value, dateFormat)}
            />
            <Field
              name="ends"
              label="Ends"
              component={renderDateTime}
              dateFormat={dateFormat}
              normalize={(value: string) => moment(value, dateFormat)}
            />
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
