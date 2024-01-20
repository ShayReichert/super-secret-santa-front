import "@testing-library/jest-dom";
import { render } from "@testing-library/react";
import Loader from "./Loader";

describe("Loader Component", () => {
  it("renders without crashing", () => {
    const { getByTestId } = render(<Loader />);
    expect(getByTestId("loader")).toBeInTheDocument();
  });

  it("has a spinner element", () => {
    const { container } = render(<Loader />);
    expect(container.querySelector(".spinner")).toBeInTheDocument();
  });
});
