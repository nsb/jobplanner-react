// @flow

import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { injectIntl, intlShape, FormattedMessage } from "react-intl";
import { RRule, rrulestr } from "rrule";
import { partialUpdateVisit } from '../actions/visits';
import LayerForm from "grommet-templates/components/LayerForm";
import Paragraph from "grommet/components/Paragraph";
import ScheduleInput from "./ScheduleInput";
import JobScheduleEdit from "./JobScheduleEdit";
import type { Visit } from "../actions/visits";
import type { Job } from "../actions/jobs";
import type { Schedule } from "../types/Schedule";
import type { State as ReduxState } from '../types/State';

const intlTitle = (
  <FormattedMessage
    id="visitUpdateFutureVisits.title"
    description="Visit update future visits title"
    defaultMessage="Update future visits?"
  />
)

const intlParagraph = (
  <FormattedMessage
    id="visitUpdateFutureVisits.paragraph1"
    description="Visit update future visits paragraph 1"
    defaultMessage="This will update the schedule for all future visits."
  />
)

const intlSubmitLabel = (
  <FormattedMessage
    id="visitUpdateFutureVisits.submitLabel"
    description="Visit update future visits submit label"
    defaultMessage="Yes, update"
  />
)

const rruleToSchedule = (rrule): Schedule => {
  return {
    freq: rrule.options.freq,
    interval: rrule.options.interval,
    byweekday: rrule.options.byweekday,
    bymonthday: rrule.options.bymonthday
  }
};

type Props = {
  visit: Visit,
  job: ?Job,
  onClose: Function,
  onUpdateFutureVisits: Function,
  token: ?string,
  partialUpdateVisit: Function
};

type State = {
  scheduleLayer: boolean,
  schedule: Schedule
};

class VisitUpdateFutureVisits extends Component<Props & { intl: intlShape }, State> {
  constructor(props: Props) {
    super();

    const { visit, job } = props;

    const recurrences = visit.recurrences || job.recurrences || null;
    const rrule = recurrences
      ? rrulestr(recurrences)
      : new RRule({
        freq: RRule.WEEKLY,
        interval: 1,
        byweekday: RRule.MO
      });

    this.state = { scheduleLayer: false, schedule: rruleToSchedule(rrule) };
  }

  _onUpdateFutureVisits = () => {
    const { token } = this.props;
    if (token) { }
  }

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
      )
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
            <ScheduleInput value={`RRULE:${new RRule({ ...schedule }).toString()}`} onClick={this.onScheduleEdit} />
            <Paragraph>
              {intlParagraph}
            </Paragraph>
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
    const { visit, token, onClose, partialUpdateVisit } = this.props;
    const { schedule } = this.state;

    return partialUpdateVisit(
        {
          id: visit.id,
          recurrences: `RRULE:${new RRule({ ...schedule }).toString()}`
        },
        token || ""
      ).then(onClose);
  };
}

const mapStateToProps = (
  { auth }: ReduxState,
  ownProps: {
    visit: Visit,
    job: Job,
    onClose: Function,
    onUpdateFutureVisits: Function,
    partialUpdateVisit: Function
  }
): Props => ({
  token: auth.token,
  visit: ownProps.visit,
  job: ownProps.job,
  onClose: ownProps.onClose,
  onUpdateFutureVisits: ownProps.onUpdateFutureVisits,
  partialUpdateVisit: ownProps.partialUpdateVisit
});

const mapDispatchToProps = (dispatch: *) =>
  bindActionCreators(
    {
      partialUpdateVisit,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(VisitUpdateFutureVisits));
