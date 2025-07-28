import { useState } from "react";
import { useAddTodoMutation, useGetAllTodosQuery } from "./todosApi";
import "./TodoForm.css";

export default function TodoForm() {
  const [title, setTitle] = useState("");
  const [addTodo] = useAddTodoMutation();
  const { data: allTodos = [] } = useGetAllTodosQuery();

  const getNextId = () => {
    const allIds = allTodos
      .map((todo) => parseInt(todo.id))
      .filter((id) => !isNaN(id));
    const maxId = allIds.length > 0 ? Math.max(...allIds) : 0;
    return (maxId + 1).toString();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (title.trim()) {
      const newTodo = {
        id: getNextId(),
        title: title.trim(),
        done: false,
      };
      await addTodo(newTodo);
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
