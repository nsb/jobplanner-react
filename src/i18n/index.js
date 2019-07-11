import React from "react";
import { FormattedMessage } from "react-intl";

export const intlFormFieldRequired = (
  <FormattedMessage
    id="form.required"
    description="Form field required"
    defaultMessage="Required"
  />
);

export const intlFormSaveLabel = (
  <FormattedMessage
    id="form.save"
    description="Form save button"
    defaultMessage="Save"
  />
);

export const intlFormSavingLabel = (
  <FormattedMessage
    id="form.saving"
    description="Form saving message"
    defaultMessage="Saving..."
  />
);

export const intlFlashSaved = ( // eslint-disable-line no-unused-vars
  <FormattedMessage
    id="flash.saved"
    description="Flash message saved"
    defaultMessage="Saved"
  />
);

export const intlFlashError = ( // eslint-disable-line no-unused-vars
  <FormattedMessage
    id="flash.error"
    description="Flash message error"
    defaultMessage="An error occurred"
  />
);

export const intlFlashDeleted = ( // eslint-disable-line no-unused-vars
  <FormattedMessage
    id="flash.deleted"
    description="Flash message deleted"
    defaultMessage="Removed"
  />
);