// @flow

import { AbilityBuilder, Ability } from "@casl/ability";
import type { Employee } from "./actions/employees";

export default function defineAbilityFor(employee: Employee) {
  const { can, build } = new AbilityBuilder(Ability);

  if (employee.role === "admin") {
    can("manage", "all"); // read-write access to everything
  } else {
    can("read", "all"); // read-only access to everything
  }

  //   cannot("delete", "Post", { published: true });

  return build();
}
