import React from "react";
import { mount } from "enzyme";
import BusinessListItem from "./businessListItem";

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
