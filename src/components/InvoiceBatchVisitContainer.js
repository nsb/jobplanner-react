// @flow

import { connect } from "react-redux";
import InvoiceBatchVisit from "./InvoiceBatchVisit";
import type { Props } from "./InvoiceBatchVisit";
import type { Visit } from "../actions/visits";
import type { State as ReduxState } from "../types/State";

const mapStateToProps = (
	state: ReduxState,
	ownProps: {
		visit: Visit,
		lineItems: Array<Visit>
	}
): Props => {

	return {
		visit: ownProps.visit,
		lineItems: []
	};
};

export default connect(mapStateToProps)(InvoiceBatchVisit);
