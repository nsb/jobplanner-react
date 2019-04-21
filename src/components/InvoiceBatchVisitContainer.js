// @flow

import { connect } from "react-redux";
import InvoiceBatchVisit from "./InvoiceBatchVisit";
import type { Props } from "./InvoiceBatchVisit";
import type { Visit } from "../actions/visits";
import type { VisitSelection } from "./InvoiceBatchVisit";
import type { State as ReduxState } from "../types/State";

const mapStateToProps = (
	state: ReduxState,
	ownProps: {
		visit: Visit,
		lineItems: Array<Visit>,
		selected: VisitSelection,
		onChange: (VisitSelection) => void
	}
): Props => {

	return {
		visit: ownProps.visit,
		lineItems: [],
		selected: ownProps.selected,
		onChange: ownProps.onChange
	};
};

export default connect(mapStateToProps)(InvoiceBatchVisit);
