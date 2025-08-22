/* eslint-disable jsx-a11y/label-has-associated-control */
import cn from 'classnames';
import { Todo } from '../../types/Todo';
type Props = {
  todo: Todo;
  deleteTodo: (id: number) => Promise<void>;
  handleActive: (value: number) => void;
};

export const TempTodo: React.FC<Props> = ({
  todo,
  deleteTodo,
  handleActive,
}) => {
  return (
    <div
      data-cy="Todo"
      className={cn('todo', {
        completed: todo.completed,
      })}
    >
      <label className="todo__status-label" htmlFor={`${todo.id}`}>
        <input
          data-cy="TodoStatus"
          type="checkbox"
          id={`${todo.id}`}
          className="todo__status"
          checked={todo.completed}
          onChange={() => handleActive(todo.id as number)}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {todo.title}
      </span>

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => deleteTodo(todo.id)}
      >
        ×
      </button>
      <div data-cy="TodoLoader" className="modal overlay is-active">
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
