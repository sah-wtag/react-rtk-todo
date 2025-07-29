import { setupServer } from "msw/node";
import { rest } from "msw";

const todos = [
  { id: "1", title: "Buy milk", done: false },
  { id: "2", title: "Read book", done: false },
];

export const handlers = [
  rest.get("/api/todos", (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(todos));
  }),
  rest.post("/api/todos", async (req, res, ctx) => {
    const newTodo = await req.json();
    todos.push(newTodo);
    return res(ctx.status(201), ctx.json(newTodo));
  }),
  rest.patch("/api/todos/:id", async (req, res, ctx) => {
    const { id } = req.params;
    const update = await req.json();
    const index = todos.findIndex((t) => t.id === id);
    if (index !== -1) {
      todos[index] = { ...todos[index], ...update };
    }
    return res(ctx.status(200), ctx.json(todos[index]));
  }),
  rest.delete("/api/todos/:id", (req, res, ctx) => {
    const { id } = req.params;
    const index = todos.findIndex((t) => t.id === id);
    if (index !== -1) todos.splice(index, 1);
    return res(ctx.status(204));
  }),
];

export const server = setupServer(...handlers);

import { server } from "./testServer";

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
