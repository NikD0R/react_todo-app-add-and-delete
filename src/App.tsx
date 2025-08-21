/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import * as todosService from './api/todos';
import { Todo } from './types/Todo';
import { ToDo } from './components/ToDo';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Filter } from './types/Filter';
import { ErrorNotification } from './components/ErrorNotification';
import { TempTodo } from './components/TempTodo';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState('');
  const [filter, setFilter] = useState<Filter>('all');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [error, setError] = useState('');
  const activeCount = todos.filter(todo => !todo.completed).length;
  const field = useRef<HTMLInputElement>(null);

  const visibleTodos = todos.filter(todo => {
    if (filter === 'active') {
      return !todo.completed;
    }

    if (filter === 'completed') {
      return todo.completed;
    }

    return true;
  });

  // eslint-disable-next-line @typescript-eslint/no-shadow
  function addTodo({ title, completed, userId }: Omit<Todo, 'id'>) {
    setError('');

    return todosService
      .addTodo({ title, completed, userId })
      .then(newTodo => {
        setTodos(currentTodos => {
          return [...currentTodos, newTodo];
        });
      })
      .catch(e => {
        setError(`Unable to add a todo`);
        throw e;
      });
  }

  function deleteTodo(id: number) {
    setIsSubmitting(true);

    return todosService
      .deleteTodo(id)
      .then(() => {
        setTodos(currentTodos => currentTodos.filter(todo => todo.id !== id));
      })
      .catch(e => {
        setError(`Unable to delete a todo`);
        throw e;
      })
      .finally(() => setIsSubmitting(false));
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    const normalizedTitle = title.trim();

    if (!normalizedTitle) {
      setError('Title should not be empty');

      return;
    }

    setIsSubmitting(true);

    setTempTodo({
      id: 0,
      title: normalizedTitle,
      completed: false,
      userId: todosService.USER_ID,
    });

    addTodo({
      title: normalizedTitle,
      completed: false,
      userId: todosService.USER_ID,
    })
      .then(() => {
        setTitle('');
        setTempTodo(null);
      })
      .finally(() => setIsSubmitting(false));
  }

  function handleActive(id: number) {
    setTodos(tds => {
      return tds.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      );
    });
  }

  useEffect(() => {
    field.current?.focus();

    if (error) {
      const timer = setTimeout(() => setError(''), 3000);

      return () => clearTimeout(timer);
    }

    todosService
      .getTodos()
      .then(setTodos)
      .catch(() => setError('Unable to load todos'));
  }, [error]);

  if (!todosService.USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <Header
        todos={todos}
        setTodos={setTodos}
        title={title}
        setTitle={setTitle}
        field={field}
        handleSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
      <div className="todoapp__content">
        <section className="todoapp__main" data-cy="TodoList">
          {/* This is a completed todo */}
          {visibleTodos.map(todo => (
            <ToDo
              handleActive={handleActive}
              todo={todo}
              deleteTodo={deleteTodo}
              isSubmitting={isSubmitting}
              key={todo.id}
            />
          ))}
          {tempTodo && (
            <TempTodo
              todo={tempTodo}
              isSubmitting={isSubmitting}
              deleteTodo={deleteTodo}
              handleActive={handleActive}
            />
          )}
          {/*  Delete and editting
          {/* This todo is being edited */}
          {/* <div data-cy="Todo" className="todo">
            <label className="todo__status-label">
              <input
                data-cy="TodoStatus"
                type="checkbox"
                className="todo__status"
              />
            </label> */}
          {/* This form is shown instead of the title and remove button */}
          {/* <form>
              <input
                data-cy="TodoTitleField"
                type="text"
                className="todo__title-field"
                placeholder="Empty todo will be deleted"
                value="Todo is being edited now"
              />
            </form>

            <div data-cy="TodoLoader" className="modal overlay">
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </div> */}
          {/* This todo is in loadind state */}
          {/* <div data-cy="Todo" className="todo">
            <label className="todo__status-label">
              <input
                data-cy="TodoStatus"
                type="checkbox"
                className="todo__status"
              />
            </label>

            <span data-cy="TodoTitle" className="todo__title">
              Todo is being saved now
            </span>

            <button type="button" className="todo__remove" data-cy="TodoDelete">
              ×
            </button> */}
          {/* 'is-active' class puts this modal on top of the todo */}
          {/* <div data-cy="TodoLoader" className="modal overlay is-active">
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </div> */}
        </section>

        {/* Hide the footer if there are no todos */}
        {todos.length > 0 && (
          <Footer
            filter={filter}
            activeCount={activeCount}
            setFilter={setFilter}
            visibleTodos={visibleTodos}
            deleteTodo={deleteTodo}
          />
        )}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <ErrorNotification error={error} setError={setError} />
    </div>
  );
};
