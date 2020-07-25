// @flow

import { AbilityBuilder, Ability } from "@casl/ability";
import type { Employee } from "./actions/employees";

export default function defineAbilityFor(employee: Employee) {
  const { can, cannot, build } = new AbilityBuilder(Ability);

  if (employee.role === "admin") {
    can("manage", "all"); // read-write access to everything
  } else {
    can("read", "Visit"); // read-only access to everything
    can("update", "Visit:completed");
    cannot("read", "Client");
    cannot("read", "Job");
    cannot("read", "Report");
    cannot("read", "Invoice");
    cannot("read", "Setting");
    cannot("read", "Integration");
  }

  //   cannot("delete", "Post", { published: true });

  return build();
}
