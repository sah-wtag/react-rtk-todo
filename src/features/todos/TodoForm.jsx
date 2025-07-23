import { useState } from "react";
import { useAddTodoMutation } from "./todosApi";
import "./TodoForm.css";

export default function TodoForm() {
  const [title, setTitle] = useState("");
  const [addTodo] = useAddTodoMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (title.trim()) {
      await addTodo({ title, done: false });
      setTitle("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="todo-form">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Add new todo"
        className="todo-input"
      />
      <button type="submit" className="todo-button">
        Add
      </button>
    </form>
  );
}
