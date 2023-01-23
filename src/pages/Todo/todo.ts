import Store from "../../store/index";

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

const storage = new Store()

export const getTodo = async () : Promise<TodoItem[]> => {
  const store = storage.getStore()
  return await store?.get(TABLE_KEY) || [];
}

export const addTodo = async (todo: TodoItem) => {
  const store = storage.getStore()
  const newTodos = await getTodo();
  newTodos.push(todo);

  return await store?.set(TABLE_KEY, newTodos);
};

export const updateTodo = async (todo: TodoItem) => {
  const store = storage.getStore()
  const newTodos = await getTodo();
  let updateTodo = newTodos.find((item) => item.id === todo.id);

  if (updateTodo) {
    updateTodo.priority = todo.priority;
    updateTodo.task = todo.task;
  }

  return await store?.set(TABLE_KEY, newTodos);
};

export const completeTodo = async (todoId: Number) => {
  const store = storage.getStore()
  const newTodos = await getTodo();
  let updateTodo = newTodos.find((item) => item.id === todoId);

  if (updateTodo) {
    updateTodo.complete = !updateTodo.complete;
  }

  return await store?.set(TABLE_KEY, newTodos);
};

export const deleteTodo = async (todoId: Number) => {
  const store = storage.getStore()
  const newTodos = await getTodo();
  const todoIndex = newTodos.findIndex((item) => item.id === todoId);
  newTodos.splice(todoIndex, 1);

  return await store?.set(TABLE_KEY, newTodos);
};

export const orderTodo = async (orderTodos: TodoItem[]) => {
  const store = storage.getStore()
  const newTodos = await getTodo();

  orderTodos.forEach((item: TodoItem) => {
    let index = newTodos.findIndex((todo) => item.id === todo.id);
    if (index !== -1) {
      newTodos.splice(index, 1);
    }
  });

  const orderedTodo = newTodos.concat(orderTodos);

  return await store?.set(TABLE_KEY, orderedTodo);
};
