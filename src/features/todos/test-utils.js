import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import { store } from "../../app/store";

const renderWithProvider = (ui, options) =>
  render(<Provider store={store}>{ui}</Provider>, options);

export * from "@testing-library/react";
export { renderWithProvider as render };
