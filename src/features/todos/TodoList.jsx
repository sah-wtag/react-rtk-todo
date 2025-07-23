import {
  useGetTodosQuery,
  useUpdateTodoMutation,
  useDeleteTodoMutation,
} from "./todosApi";
import { useState } from "react";
import "./TodoList.css";

export default function TodoList() {
  const [page, setPage] = useState(1);
  const { data: todos = [], isLoading } = useGetTodosQuery(page);
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

  if (isLoading) return <p>Loading...</p>;

  return (
    <>
      <ul className="todo-list">
        {todos.map((todo) => (
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
                onClick={() => toggleDone(todo)}
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
                </>
              )}
            </div>
          </li>
        ))}
      </ul>

      <div className="pagination">
        <button onClick={() => setPage((p) => Math.max(p - 1, 1))}>Prev</button>
        <span>Page {page}</span>
        <button onClick={() => setPage((p) => p + 1)}>Next</button>
      </div>
    </>
  );
}
