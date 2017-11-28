import React from "react";
import { configure, mount } from "enzyme";
import Adapter from "enzyme-adapter-react-15";
import BusinessListItem from "../../components/businessListItem";

configure({ adapter: new Adapter() });

function setup() {
  const props = {
    business: { id: 1, name: "Idealrent", timezone: "Europe/Copenhagen" },
    index: 1,
    onClick: jest.fn()
  };

  const enzymeWrapper = mount(<BusinessListItem {...props} />);

  return {
    props,
    enzymeWrapper
  };
}

describe("components", () => {
  describe("BusinessListItem", () => {
    it("should render self and subcomponents", () => {
      const { enzymeWrapper } = setup();

      expect(enzymeWrapper.text()).toBe("Idealrent");

    });

    it("should call onClick", () => {
      const { enzymeWrapper, props } = setup();
      enzymeWrapper.props().onClick();
      expect(props.onClick.mock.calls.length).toBe(1);
    });
  });
});
