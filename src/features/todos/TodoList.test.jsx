import React from "react";
import { render, screen, fireEvent } from "./test-utils";
import TodoList from "./TodoList";

import * as todosApi from "./todosApi";

jest.mock("./todosApi", () => {
  const actual = jest.requireActual("./todosApi");
  return {
    ...actual,
    useGetTodosQuery: jest.fn(),
    useGetAllTodosQuery: jest.fn(),
  };
});

test("renders todos and supports search", async () => {
  todosApi.useGetTodosQuery.mockReturnValue({
    data: {
      todos: [
        { id: "1", title: "Buy milk", done: false },
        { id: "2", title: "Walk dog", done: true },
      ],
      totalCount: 2,
      currentPage: 1,
      limit: 5,
      totalPages: 1,
    },
    isLoading: false,
    isError: false,
  });

  todosApi.useGetAllTodosQuery.mockReturnValue({
    data: [
      { id: "1", title: "Buy milk", done: false },
      { id: "2", title: "Walk dog", done: true },
    ],
    isLoading: false,
    isError: false,
  });

  render(<TodoList />);

  expect(await screen.findByText(/Buy milk/i)).toBeInTheDocument();

  const searchInput = screen.getByPlaceholderText(/search todos/i);
  fireEvent.change(searchInput, { target: { value: "milk" } });

  expect(screen.getByText(/Buy milk/i)).toBeInTheDocument();
});
