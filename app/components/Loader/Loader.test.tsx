import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import Loader from "./Loader";

describe("Loader Component", () => {
  it("renders without crashing", () => {
    render(<Loader />);
    expect(screen.getByTestId("loader")).toBeInTheDocument();
  });

  it("has a spinner element", () => {
    render(<Loader />);
    expect(screen.getByTestId("spinner")).toBeInTheDocument();
  });
});
