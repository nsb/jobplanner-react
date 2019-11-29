// @flow

import React from "react";
import type { Visit } from "../actions/visits";

type Props = {
  event: Visit,
  title: string
};

export default ({ title }: Props) =>
  <div>
    {title}
  </div>
