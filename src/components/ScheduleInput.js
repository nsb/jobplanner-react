import React, { Component } from "react";
import { RRule, rrulestr } from "rrule";
import Anchor from "grommet/components/Anchor";
import Heading from "grommet/components/Heading";
import EditIcon from "grommet/components/icons/base/Edit";

type ScheduleProps = {
    value: ?string,
    onClick: Function
  };
  
class ScheduleInput extends Component<ScheduleProps> {
    render() {
      const { value, onClick } = this.props;
      let rule = value ? rrulestr(value) : new RRule({
        freq: RRule.WEEKLY,
        interval: 1,
        byweekday: RRule.MO
      });
      return (
        <div>
          <Heading tag="h4">Visit frequency</Heading>
          <Anchor
            icon={<EditIcon />}
            label="Label"
            href="#"
            reverse={true}
            onClick={onClick}
          >
            {rule.toText()}
          </Anchor>
        </div>
      );
    }
  
    onChange(e: SyntheticInputEvent<*>) {
      console.log(e);
    }
  }

export default ScheduleInput;