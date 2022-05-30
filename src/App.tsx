import React, {
  ChangeEventHandler,
  FormEventHandler,
  MouseEventHandler,
  useEffect,
  useState,
} from 'react';

import { useTodoStorageService } from './services/useTodoStorage';
import LocalStoragePersistenceAdapter from "./services/localStoragePersistenceAdapter";
import { PersistenceServices } from './application/persistanceService';
import idGeneratorAdapter from './services/idGeneratorAdapter';
import { useIntroductionService } from './services/useIntroductionService';
import { idGeneratorService } from './application/idGeneratorService';
function App({persistence, idGen}: {persistence: PersistenceServices, idGen: idGeneratorService}) {

  const [isAdding, setAdding] = useState(false);
  const [newTodo, setNewTodo] = useState("");
  //const persistence = new LocalStoragePersistenceAdapter() as PersistenceServices;
  const todoStorage = useTodoStorageService(persistence, idGen);
  useIntroductionService(persistence, todoStorage);


  const todoInputHandler: ChangeEventHandler<HTMLInputElement> = (e) => {
    setNewTodo(e.target.value);
  };

  const addClickHandler: MouseEventHandler = () => {
    if (isAdding) {
      setAdding(false);
      setNewTodo('');
    } else {
      setAdding(true);
    }
  };

  const submitHandler: FormEventHandler = (e) => {
    e.preventDefault();
    todoStorage.addTodo({text:newTodo});
    setAdding(false);
  };

  return (
    <div>
      <div style={{backgroundColor: 'lightpink', padding: '12px'}}>
        <span style={{WebkitMarginEnd: '12px'}}>Midient Todolist</span>
        <button onClick={addClickHandler}>{isAdding ? 'Cancel' : 'Add'}</button>
      </div>

      {isAdding && (
        <form onSubmit={submitHandler} style={{margin: '12px'}}>
          <input type="text" data-testId="todo-input" onChange={todoInputHandler} />
          <input type="submit" data-testId="todo-submit"/>
        </form>
      )}

      <ol>
        {todoStorage.todos.map(todo => (
          <li key={todo.id}>
            <button
              data-testId="delete-todo"
              style={{WebkitMarginEnd: '8px'}}
              id={todo.id}
              onClick={() => todoStorage.deleteTodo(todo.id)}
            >
              delete 
            </button>
            <span>{todo.text}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

export default App;
