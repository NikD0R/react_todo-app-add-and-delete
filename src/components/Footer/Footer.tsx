import { Filter } from '../../types/Filter';
import { Todo } from '../../types/Todo';
import cn from 'classnames';

type Props = {
  filter: Filter;
  activeCount: number;
  setFilter: React.Dispatch<React.SetStateAction<Filter>>;
  visibleTodos: Todo[];
  deleteTodo: (id: number) => void;
};

export const Footer: React.FC<Props> = ({
  filter,
  activeCount,
  setFilter,
  visibleTodos,
  deleteTodo,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeCount} items left
      </span>

      {/* Active link should have the 'selected' class */}
      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={cn('filter__link', {
            selected: filter === 'all',
          })}
          data-cy="FilterLinkAll"
          onClick={() => setFilter('all')}
        >
          All
        </a>

        <a
          href="#/active"
          className={cn('filter__link', {
            selected: filter === 'active',
          })}
          data-cy="FilterLinkActive"
          onClick={() => setFilter('active')}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={cn('filter__link', {
            selected: filter === 'completed',
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => setFilter('completed')}
        >
          Completed
        </a>
      </nav>

      {/* this button should be disabled if there are no completed todos */}
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={visibleTodos.every(todo => !todo.completed)}
        onClick={() => {
          const completedTodo = visibleTodos.filter(todo => todo.completed);

          completedTodo.forEach(todo => deleteTodo(todo.id));
        }}
      >
        Clear completed
      </button>
    </footer>
  );
};
