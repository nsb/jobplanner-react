// @flow

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { ensureState } from "redux-optimistic-ui";
import { change } from "redux-form";
import type { State as ReduxState } from "../types/State";
import VisitLineItemsForm from "./VisitLineItemsForm";
import type { LineItemProps as Props } from "./LineItemsForm";
import type { Dispatch } from "../types/Store";
import type { Fields } from 'redux-form/lib/FieldArrayProps.types'

const mapStateToProps = (
  state: ReduxState,
  {
    fields,
    meta
  }: {
    fields: Fields,
    meta: { dirty: boolean, error: ?string, submitFailed: boolean }
  }
): Props => {
  const { entities, services } = state;

  return {
    formName: "visit",
    suggestions: services.result.map((Id: number) => {
      let service = ensureState(entities).services[Id];
      return { label: service.name, value: service };
    }),
    fields: fields,
    meta: meta,
    change
  };
};

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators({ change }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(VisitLineItemsForm);