// @flow

import React, { Component } from "react";
import { connect } from "react-redux";
import { Field, formValueSelector, reduxForm } from "redux-form";
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
import type { Client } from "../actions/clients";
import type { Dispatch } from "../types/Store";

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
}): Component<*> =>
  <FormField label={label} htmlFor={input.name} error={touched ? error : null}>
    <input {...input} type={type} />
  </FormField>;

const renderCheckBox = ({
  input,
  label,
  meta: { touched, error, warning }
}): Component<*> =>
  <FormField label={label} htmlFor={input.name} error={touched ? error : null}>
    <CheckBox {...input} checked={input.value} />
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
}): Component<*> => {
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
}): Component<*> => {
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

type Props = {
  value: string,
  onClick: Function
};

class ScheduleInput extends Component<Props> {
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
}): Component<*> => <ScheduleInput {...input} onClick={onClick} />;

type JobFormProps = {
  handleSubmit?: Function,
  valid: boolean,
  clients: Array<Client>,
  dirty: boolean,
  submitting: boolean,
  onClose?: Function,
  initialValues: Object,
  // onChange?: Function,
  dispatch: Dispatch,
  change: Function,
  anytime: boolean
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
      clients,
      handleSubmit,
      valid,
      dirty,
      submitting,
      onClose,
      initialValues,
      anytime
    } = this.props;

    const filteredClients = clients.filter(client => {
      const searchText = this.state.clientsSearchText.toLowerCase();
      if (searchText) {
        return `${client.first_name} ${client.last_name}`
          .toLowerCase()
          .includes(searchText);
      } else {
        return true;
      }
    });

    const mappedClients = filteredClients.map(client => {
      return {
        value: client.id,
        label: `${client.first_name} ${client.last_name}`
      };
    });

    return (
      <Form onSubmit={handleSubmit}>

        <Header size="large" justify="between" pad="none">
          <Heading tag="h2" margin="none" strong={true}>
            {initialValues ? "Edit job" : "Add Job"}
          </Heading>
          <Anchor icon={<CloseIcon />} onClick={onClose} a11yTitle="Close" />
        </Header>

        <FormFields>

          <fieldset>

            <Heading tag="h3">Job details</Heading>
            <Field
              name="client"
              label="Client"
              component={renderSelect}
              options={mappedClients}
              onSearch={this.onSearch}
              // onChange={this.onChange}
              normalize={normalizeSelect}
            />
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
              dateFormat={anytime ? "M/D/YYYY" : "M/D/YYYY h:mm a"}
            />
            <Field
              name="ends"
              label="Ends"
              component={renderDateTime}
              dateFormat={anytime ? "M/D/YYYY" : "M/D/YYYY h:mm a"}
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
