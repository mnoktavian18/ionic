import { useEffect, useState } from "react";
import { useLocation } from "react-router";
import { useStorage } from './useStorage';

const TABLE_KEY = "todos";

export interface TodoItem {
  id: Number;
  task: string;
  priority: TodoPriorityEnum;
  complete: boolean;
}

export enum TodoPriorityEnum {
  urgent = 1,
  high = 2,
  normal = 3,
}

export function useTodo() {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const {store} = useStorage();
  const location = useLocation();

  useEffect(() => {
    const init = async () => {
      const todos = await store?.get(TABLE_KEY) || [];
      console.log('useTodo', todos)
      setTodos(todos)
    };

    init();
  }, [store, location.pathname]);

  const addTodo = async (todo: TodoItem) => {
    const newTodos = [...todos];
    newTodos.push(todo);

    const data = await store?.set(TABLE_KEY, newTodos);
    setTodos(data);
  };

  const updateTodo = async (todo: TodoItem) => {
    const newTodos = [...todos];
    let updateTodo = newTodos.find((item) => item.id === todo.id);

    if (updateTodo) {
      updateTodo.priority = todo.priority;
      updateTodo.task = todo.task;
    }

    setTodos(newTodos);
    await store?.set(TABLE_KEY, newTodos);
  };

  const completeTodo = async (todoId: Number) => {
    const newTodos = [...todos];
    let updateTodo = newTodos.find((item) => item.id === todoId);

    if (updateTodo) {
      updateTodo.complete = !updateTodo.complete;
    }

    setTodos(newTodos);
    await store?.set(TABLE_KEY, newTodos);
  };

  const deleteTodo = async (todoId: Number) => {
    const newTodos = [...todos];
    const todoIndex = newTodos.findIndex((item) => item.id === todoId);
    newTodos.splice(todoIndex, 1);
    setTodos(newTodos);

    await store?.set(TABLE_KEY, newTodos);
  };

  const orderTodo = async (orderTodos: TodoItem[]) => {
    const newTodos = [...todos];

    orderTodos.forEach((item: TodoItem) => {
      let index = newTodos.findIndex((todo) => item.id === todo.id);
      if (index !== -1) {
        newTodos.splice(index, 1);
      }
    });

    const orderedTodo = newTodos.concat(orderTodos);
    setTodos(orderedTodo);

    await store?.set(TABLE_KEY, orderedTodo);
  };

  return {
    todos,
    addTodo,
    updateTodo,
    deleteTodo,
    orderTodo,
    completeTodo
  };
}
