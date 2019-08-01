// @flow

import React, { Component } from "react";
import { injectIntl, intlShape, FormattedMessage } from "react-intl";
import moment from "moment";
import Layer from "grommet/components/Layer";
import Sidebar from "grommet/components/Sidebar";
import Header from "grommet/components/Header";
import Button from "grommet/components/Button";
import Heading from "grommet/components/Heading";
import Select from "grommet/components/Select";
import CloseIcon from "grommet/components/icons/base/Close";
import Form from "grommet/components/Form";
import FormFields from "grommet/components/FormFields";
import FormField from "grommet/components/FormField";
import DateTime from "grommet/components/DateTime";
import CheckBox from "grommet/components/CheckBox";
import Footer from "grommet/components/Footer";
import type { Employee } from "../actions/employees";

const intlTitle = (
  <FormattedMessage
    id="visitsReportFilter.title"
    description="Visits report filter title"
    defaultMessage="Filter"
  />
)

const intlFrom = (
  <FormattedMessage
    id="visitsReportFilter.fromLabel"
    description="Visits report filter from label"
    defaultMessage="From"
  />
)

const intlTo = (
  <FormattedMessage
    id="visitsReportFilter.toLabel"
    description="Visits report filter to label"
    defaultMessage="To"
  />
)

const intlStatus = (
  <FormattedMessage
    id="visitsReportFilter.statusLabel"
    description="Visits report filter status label"
    defaultMessage="Status"
  />
)

const intlCompleted = (
  <FormattedMessage
    id="visitsReportFilter.statusCompleted"
    description="Visits report filter status completed"
    defaultMessage="Completed"
  />
)

const intlIncomplete = (
  <FormattedMessage
    id="visitsReportFilter.statusIncomplete"
    description="Visits report filter status incomplete"
    defaultMessage="Incomplete"
  />
)

const intlAssigned = (
  <FormattedMessage
    id="visitsReportFilter.assignedLabel"
    description="Visits report filter assigned label"
    defaultMessage="Assigned to"
  />
)

const intlAll = ( // eslint-disable-line no-unused-vars
  <FormattedMessage
    id="visitsReportFilter.assignedPlaceholder"
    description="Visits report filter assigned all"
    defaultMessage="All"
  />
)

const intlApply = (
  <FormattedMessage
    id="visitsReportFilter.applyLabel"
    description="Visits report filter apply label"
    defaultMessage="Apply"
  />
)

export type FilterValues = {
  begins: Date,
  ends: Date,
  complete: boolean,
  incomplete: boolean,
  assigned: ?{ value: number, label: string }
};

type Props = {
  onClose: Function,
  onSubmit: Function,
  employees: Array<Employee>,
  filterValues: FilterValues
};

type State = FilterValues;

class VisitsReportFilter extends Component<Props & { intl: intlShape }, State> {
  dateFormat: string;
  static defaultProps = {
    employees: []
  };

  constructor(props: Props & { intl: intlShape }) {
    super(props);
    this.dateFormat = moment()
      .creationData()
      .locale.longDateFormat("L");
    this.state = this.props.filterValues;
  }

  render() {
    const { employees, intl } = this.props;

    return (
      <Layer
        align="right"
        flush={true}
        closer={false}
        a11yTitle={intlTitle}
      >
        <Sidebar size="medium">
          <div>
            <Header
              size="small"
              justify="between"
              align="center"
              pad={{ horizontal: "medium", vertical: "none" }}
            >
              <Heading tag="h3" margin="none">
                {intlTitle}
              </Heading>
              <Button
                icon={<CloseIcon />}
                plain={true}
                onClick={this.props.onClose}
              />
            </Header>
            <Form pad="medium" onSubmit={this._onSubmit}>
              <FormFields>
                <FormField label={intlFrom}>
                  <DateTime
                    id="begins"
                    name="begins"
                    format={this.dateFormat}
                    onChange={this.onBeginsChange}
                    value={this.state.begins}
                  />
                </FormField>
                <FormField label={intlTo}>
                  <DateTime
                    id="ends"
                    name="ends"
                    format={this.dateFormat}
                    onChange={this.onEndsChange}
                    value={this.state.ends}
                  />
                </FormField>
                <FormField label={intlStatus}>
                  <CheckBox
                    name="complete"
                    label={intlCompleted}
                    checked={this.state.complete}
                    onChange={this.onCompleteChange}
                  />
                  <CheckBox
                    name="incomplete"
                    label={intlIncomplete}
                    checked={this.state.incomplete}
                    onChange={this.onIncompleteChange}
                  />
                </FormField>
                <FormField label={intlAssigned}>
                  <Select
                    name="assigned"
                    placeHolder={intl.formatMessage({id: "visitsReportFilter.assignedPlaceholder"})}
                    options={employees.map(employee => {
                      return { value: employee.id, label: employee.username };
                    })}
                    inline={false}
                    multiple={false}
                    value={this.state.assigned}
                    onChange={this.onEmployeesChange}
                  />
                </FormField>
              </FormFields>
              <Footer pad={{ vertical: "medium" }}>
                <Button label={intlApply} type="submit" primary={true} />
              </Footer>
            </Form>
          </div>
        </Sidebar>
      </Layer>
    );
  }

  onEmployeesChange = ({
    value
  }: {
    value: { value: number, label: string }
  }) => {
    console.log(value);
    this.setState({ assigned: value });
  };

  onBeginsChange = (date: Date) => {
    this.setState({ begins: moment(date, this.dateFormat).toDate() });
  };

  onEndsChange = (date: Date) => {
    this.setState({ ends: moment(date, this.dateFormat).toDate() });
  };

  onCompleteChange = ({ target }: SyntheticInputEvent<HTMLInputElement>) => {
    this.setState({ complete: target.checked });
  };

  onIncompleteChange = ({ target }: SyntheticInputEvent<HTMLInputElement>) => {
    this.setState({ incomplete: target.checked });
  };

  _onSubmit = (event: SyntheticInputEvent<HTMLInputElement>) => {
    event.preventDefault();
    const { onSubmit } = this.props;
    onSubmit(this.state);
  };
}

export default injectIntl(VisitsReportFilter);
