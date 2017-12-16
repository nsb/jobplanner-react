// @flow

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { ensureState } from "redux-optimistic-ui";
import { change } from "redux-form";
import type { State as ReduxState } from "../types/State";
import LineItemsForm from "./LineItemsForm";
import type { LineItemProps as Props } from "./LineItemsForm";

const mapStateToProps = (state: ReduxState, ownProps: {}): Props => {
  const { entities, services } = state;

  return {
    suggestions: services.result.map((Id: number) => {
      let service = ensureState(entities).services[Id];
      return { label: service.name, value: service };
    }),
    change
  };
};

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators({ change }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(LineItemsForm);
