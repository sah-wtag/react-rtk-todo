import { useState } from "react";
import {
  useGetTodosQuery,
  useUpdateTodoMutation,
  useDeleteTodoMutation,
} from "./todosApi";
import "./TodoList.css";

export default function TodoList() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const { data: todos = [], isLoading } = useGetTodosQuery({ page, search });
  console.log("search:", search, "page:", page, "todos:", todos);

  const [updateTodo] = useUpdateTodoMutation();
  const [deleteTodo] = useDeleteTodoMutation();

  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");

  const startEditing = (todo) => {
    setEditingId(todo.id);
    setEditTitle(todo.title);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditTitle("");
  };

  const saveEdit = async (todo) => {
    if (editTitle.trim()) {
      await updateTodo({ ...todo, title: editTitle });
      cancelEditing();
    }
  };

  const toggleDone = async (todo) => {
    await updateTodo({ id: todo.id, done: !todo.done });
  };

  const removeTodo = async (id) => {
    await deleteTodo(id);
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <>
      {/* 🔍 Search Bar */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Search todos..."
          value={search}
          onChange={handleSearch}
          className="search-input"
        />
      </div>

      <ul className="todo-list">
        {[...todos].reverse().map((todo) => (
          <li key={todo.id} className="todo-item">
            {editingId === todo.id ? (
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") saveEdit(todo);
                  if (e.key === "Escape") cancelEditing();
                }}
                className="edit-input"
                autoFocus
              />
            ) : (
              <span
                style={{
                  textDecoration: todo.done ? "line-through" : "none",
                }}
                className="todo-title"
              >
                {todo.title}
              </span>
            )}

            <div className="button-group">
              {editingId === todo.id ? (
                <>
                  <button onClick={() => saveEdit(todo)} className="btn green">
                    Save
                  </button>
                  <button onClick={cancelEditing} className="btn gray">
                    Cancel
                  </button>
                </>
              ) : todo.done ? (
                <>
                  <button
                    onClick={() => toggleDone(todo)}
                    className="btn orange"
                  >
                    UNDONE
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => startEditing(todo)}
                    className="btn blue"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => removeTodo(todo.id)}
                    className="btn red"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => toggleDone(todo)}
                    className="btn green"
                  >
                    DONE
                  </button>
                </>
              )}
            </div>
          </li>
        ))}
      </ul>

      {/* Pagination */}
      <div className="pagination">
        <button onClick={() => setPage((p) => Math.max(p - 1, 1))}>Prev</button>
        <span>Page {page}</span>
        <button onClick={() => setPage((p) => p + 1)}>Next</button>
      </div>
    </>
  );
}
