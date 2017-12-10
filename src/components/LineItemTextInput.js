import onClickOutside from "react-onclickoutside";
import TextInput from "grommet/components/TextInput";

class LineItemTextInput extends TextInput {
  handleClickOutside = event => this._onRemoveDrop();

  componentDidUpdate(prevProps, prevState) {
    super.componentDidUpdate(prevProps, prevState);
    document.removeEventListener("click", this._onRemoveDrop);
  }

  _onFocus = event => this._onInputChange(event);
}

export default onClickOutside(LineItemTextInput);
