import { screen, fireEvent, waitFor, render } from "./test-utils";
import TodoForm from "./TodoForm";

test("adds a new todo", async () => {
  render(<TodoForm />);
  const input = screen.getByPlaceholderText(/add new todo/i);
  fireEvent.change(input, { target: { value: "Buy groceries" } });

  const button = screen.getByRole("button", { name: /add/i });
  fireEvent.click(button);

  await waitFor(() => {
    expect(input.value).toBe("");
  });
});
