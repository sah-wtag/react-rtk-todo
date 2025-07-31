import TodoForm from "./features/todos/TodoForm";
import TodoList from "./features/todos/TodoList";

function App() {
  return (
    <div className="max-w-md mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4 text-center">RTK TODO App</h1>
      <TodoForm />
      <TodoList />
    </div>
  );
}

export default App;
