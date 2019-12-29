// @flow

import { connect } from "react-redux";
import InvoiceBatchVisit from "./InvoiceBatchVisit";
import type { Props } from "./InvoiceBatchVisit";
import type { Visit } from "../actions/visits";
import type { VisitSelection } from "../utils/invoices";
import type { State as ReduxState } from "../types/State";

const mapStateToProps = (
	state: ReduxState,
	ownProps: {
		visit: Visit,
		selected: VisitSelection,
		onChange: (VisitSelection) => void
	}
): Props => {
	return {
		visit: ownProps.visit,
		selected: ownProps.selected,
		onChange: ownProps.onChange
	};
};

export default connect(mapStateToProps)(InvoiceBatchVisit);
