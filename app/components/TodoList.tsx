'use client';

import { useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: string;
}

export default function TodoList() {
  const [todos, setTodos] = useLocalStorage<Todo[]>('todos', []);
  const [newTodo, setNewTodo] = useState('');
  const [showCompleted, setShowCompleted] = useState(true);

  const addTodo = () => {
    if (!newTodo.trim()) return;

    const todo: Todo = {
      id: Date.now().toString(),
      text: newTodo.trim(),
      completed: false,
      createdAt: new Date().toISOString(),
    };

    setTodos([...todos, todo]);
    setNewTodo('');
  };

  const toggleTodo = (id: string) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const activeTodos = todos.filter((todo) => !todo.completed);
  const completedTodos = todos.filter((todo) => todo.completed);

  return (
    <div className="rounded-2xl border border-zinc-200/80 bg-white/90 backdrop-blur-xl p-8 shadow-xl dark:border-zinc-800/80 dark:bg-zinc-900/90">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-2xl font-light tracking-tight text-zinc-900 dark:text-zinc-100">
          To-Do List
        </h3>
        {completedTodos.length > 0 && (
          <button
            onClick={() => setShowCompleted(!showCompleted)}
            className="text-xs text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
          >
            {showCompleted ? 'Hide' : 'Show'} completed ({completedTodos.length})
          </button>
        )}
      </div>

      <div className="mb-6 flex gap-3">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addTodo()}
          placeholder="Add a task..."
          className="flex-1 rounded-xl border border-zinc-200/80 bg-white/50 px-4 py-3 text-sm font-light text-zinc-900 transition-all focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-700 dark:bg-zinc-800/50 dark:text-zinc-100 dark:focus:border-blue-500"
        />
        <button
          onClick={addTodo}
          className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-3 text-sm font-medium text-white shadow-lg transition-all hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl dark:from-blue-500 dark:to-indigo-500 dark:hover:from-blue-600 dark:hover:to-indigo-600"
        >
          Add
        </button>
      </div>

      <div className="space-y-2">
        {activeTodos.length === 0 && completedTodos.length === 0 ? (
          <div className="py-8 text-center text-sm text-zinc-500 dark:text-zinc-400">
            No tasks yet. Add one above! ✨
          </div>
        ) : (
          <>
            {activeTodos.map((todo) => (
              <div
                key={todo.id}
                className="group flex items-center gap-3 rounded-xl border border-zinc-200/80 bg-white/50 p-4 transition-all hover:border-zinc-300 hover:bg-white hover:shadow-sm dark:border-zinc-700 dark:bg-zinc-800/50 dark:hover:border-zinc-600 dark:hover:bg-zinc-800"
              >
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleTodo(todo.id)}
                  className="h-4 w-4 rounded border-zinc-300 text-blue-600 focus:ring-2 focus:ring-blue-500/20"
                />
                <span className="flex-1 text-sm text-zinc-900 dark:text-zinc-100">
                  {todo.text}
                </span>
                <button
                  onClick={() => deleteTodo(todo.id)}
                  className="opacity-0 text-zinc-400 transition-opacity hover:text-red-500 group-hover:opacity-100"
                >
                  ✕
                </button>
              </div>
            ))}

            {showCompleted && completedTodos.length > 0 && (
              <div className="mt-4 border-t border-zinc-200 pt-4 dark:border-zinc-700">
                <div className="mb-2 text-xs font-medium text-zinc-500 dark:text-zinc-400">
                  Completed
                </div>
                {completedTodos.map((todo) => (
                  <div
                    key={todo.id}
                    className="group flex items-center gap-3 rounded-lg border border-zinc-200 bg-zinc-50 p-3 opacity-60 dark:border-zinc-700 dark:bg-zinc-800/50"
                  >
                    <input
                      type="checkbox"
                      checked={todo.completed}
                      onChange={() => toggleTodo(todo.id)}
                      className="h-4 w-4 rounded border-zinc-300 text-blue-600 focus:ring-2 focus:ring-blue-500/20"
                    />
                    <span className="flex-1 text-sm line-through text-zinc-600 dark:text-zinc-400">
                      {todo.text}
                    </span>
                    <button
                      onClick={() => deleteTodo(todo.id)}
                      className="opacity-0 text-zinc-400 transition-opacity hover:text-red-500 group-hover:opacity-100"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

