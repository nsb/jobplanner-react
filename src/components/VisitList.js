// @flow

import React from "react";
import { injectIntl, intlShape } from "react-intl";
import Box from "grommet/components/Box";
import List from "grommet/components/List";
import ListPlaceholder from "grommet-addons/components/ListPlaceholder";
import VisitListItem from "./VisitListItem";
import type { Visit } from "../actions/visits";

type Props = {
  visits?: Array<Visit>,
  isFetching?: boolean,
  onMore: () => void,
  onClick: (SyntheticInputEvent, Visit) => void,
  intl: intlShape
};

const VisitList = ({
  business,
  visits = [],
  isFetching = true,
  onMore,
  onClick,
  intl
}: Props) =>
  <Box>
    <List onMore={isFetching ? undefined : onMore}>
      {visits.map((visit: Visit, index: number) => {
        return (
          <VisitListItem
            key={visit.id}
            visit={visit}
            index={index}
            onClick={e => onClick(e, visit)}
          />
        );
      })}
    </List>
    <ListPlaceholder
      filteredTotal={isFetching ? null : visits.length}
      unfilteredTotal={isFetching ? null : visits.length}
      emptyMessage={intl.formatMessage({
        id: "visits.emptyMessage",
        defaultMessage: "You do not have any visits at the moment."
      })}
    />
  </Box>;

export default injectIntl(VisitList);
