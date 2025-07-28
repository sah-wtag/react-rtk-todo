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

  const { data, isLoading, error } = useGetTodosQuery({ page, search });
  const todos = data?.todos || [];
  const totalCount = data?.totalCount || 0;
  const totalPages = data?.totalPages || 1;

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
    if (todos.length === 1 && page > 1) {
      setPage(page - 1); // Go back if last item on page is deleted
    }
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading todos: {error.toString()}</p>;

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

      {/* Todo List */}
      {todos.length === 0 ? (
        <p className="no-todos">
          {search
            ? "No todos found matching your search."
            : "No todos yet. Add one above!"}
        </p>
      ) : (
        <ul className="todo-list">
          {todos.map((todo) => (
            <li key={`${todo.id}-${page}`} className="todo-item">
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
                    cursor: "pointer",
                  }}
                  className="todo-title"
                >
                  {todo.title}
                </span>
              )}

              <div className="button-group">
                {editingId === todo.id ? (
                  <>
                    <button
                      onClick={() => saveEdit(todo)}
                      className="btn green"
                    >
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
      )}

      {/* Pagination */}
      {totalCount > 5 && (
        <div className="pagination">
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
          >
            Prev
          </button>
          <span>
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            disabled={page >= totalPages}
          >
            Next
          </button>
        </div>
      )}
    </>
  );
}
