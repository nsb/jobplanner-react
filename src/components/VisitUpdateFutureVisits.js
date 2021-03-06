// @flow

import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { injectIntl, intlShape, FormattedMessage } from "react-intl";
import { addSuccess, addError } from "redux-flash-messages";
import { RRule, rrulestr } from "rrule";
import { partialUpdateVisit } from "../actions/visits";
import LayerForm from "grommet-templates/components/LayerForm";
import Paragraph from "grommet/components/Paragraph";
import ScheduleInput from "./ScheduleInput";
import JobScheduleEdit from "./JobScheduleEdit";
import { AuthContext } from "../providers/authProvider";
import type { Visit } from "../actions/visits";
import type { Job } from "../actions/jobs";
import type { Schedule } from "../types/Schedule";
import type { State as ReduxState } from "../types/State";

const intlTitle = (
  <FormattedMessage
    id="visitUpdateFutureVisits.title"
    description="Visit update future visits title"
    defaultMessage="Update future visits?"
  />
);

const intlParagraph = (
  <FormattedMessage
    id="visitUpdateFutureVisits.paragraph1"
    description="Visit update future visits paragraph 1"
    defaultMessage="This will update the schedule for all future visits."
  />
);

const intlSubmitLabel = (
  <FormattedMessage
    id="visitUpdateFutureVisits.submitLabel"
    description="Visit update future visits submit label"
    defaultMessage="Yes, update"
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

type Props = {
  visit: Visit,
  job: ?Job,
  onClose: Function,
  onUpdateFutureVisits: Function,
  partialUpdateVisit: Function
};

type State = {
  scheduleLayer: boolean,
  schedule: Schedule
};

class VisitUpdateFutureVisits extends Component<
  Props & { intl: intlShape },
  State
> {
  static contextType = AuthContext;

  constructor(props: Props) {
    super();

    const { visit, job } = props;

    const recurrences = visit.recurrences || (job && job.recurrences) || null;
    const rrule = recurrences
      ? rrulestr(recurrences)
      : new RRule({
          freq: RRule.WEEKLY,
          interval: 1,
          byweekday: RRule.MO
        });

    this.state = { scheduleLayer: false, schedule: rruleToSchedule(rrule) };
  }

  _onUpdateFutureVisits = () => {};

  render() {
    const { onClose } = this.props;
    const { schedule } = this.state;

    if (this.state.scheduleLayer) {
      return (
        <JobScheduleEdit
          onClose={onClose}
          onSubmit={this.onScheduleSubmit}
          schedule={this.state.schedule}
        />
      );
    } else {
      return (
        <LayerForm
          title={intlTitle}
          submitLabel={intlSubmitLabel}
          compact={true}
          onClose={onClose}
          onSubmit={this.handleSubmit}
        >
          <fieldset>
            <ScheduleInput
              value={new RRule({ ...schedule }).toString()}
              onClick={this.onScheduleEdit}
            />
            <Paragraph>{intlParagraph}</Paragraph>
          </fieldset>
        </LayerForm>
      );
    }
  }

  onScheduleEdit = (e: SyntheticInputEvent<*>) => {
    this.setState({ scheduleLayer: true });
    e.preventDefault();
  };

  onScheduleSubmit = (schedule: Schedule) => {
    this.setState({
      scheduleLayer: false,
      schedule
    });
  };

  handleSubmit = values => {
    const { visit, onClose, partialUpdateVisit, intl } = this.props;
    const { schedule } = this.state;

    const { getUser } = this.context;
    return getUser().then(({ access_token }) => {
      return partialUpdateVisit(
        {
          id: visit.id,
          recurrences: new RRule({ ...schedule }).toString()
        },
        access_token || ""
      )
    }).then(() => {
      addSuccess({ text: intl.formatMessage({ id: "flash.saved" }) });
    })
    .catch(() => {
      addError({ text: intl.formatMessage({ id: "flash.error" }) });
    })
    .finally(onClose);
  };
}

const mapStateToProps = (
  state: ReduxState,
  ownProps: {
    visit: Visit,
    job: Job,
    onClose: Function,
    onUpdateFutureVisits: Function,
    partialUpdateVisit: Function
  }
): Props => ({
  visit: ownProps.visit,
  job: ownProps.job,
  onClose: ownProps.onClose,
  onUpdateFutureVisits: ownProps.onUpdateFutureVisits,
  partialUpdateVisit: ownProps.partialUpdateVisit
});

const mapDispatchToProps = (dispatch: *) =>
  bindActionCreators(
    {
      partialUpdateVisit
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(injectIntl(VisitUpdateFutureVisits));
