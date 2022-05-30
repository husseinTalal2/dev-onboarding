import React from 'react';
import {render, screen, fireEvent, cleanup, waitFor } from '@testing-library/react';
import App from './App';
import LocalStoragePersistenceAdapter from './services/localStoragePersistenceAdapter';
import userEvent from '@testing-library/user-event';
import idGeneratorAdapter from './services/idGeneratorAdapter';

describe("<App /> is functioning well", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('the app renders', () => {
    render(<App persistence={new LocalStoragePersistenceAdapter()} idGen={idGeneratorAdapter} />);
  
    const linkElement = screen.getByText(/Midient/i);
  
    expect(linkElement).toBeInTheDocument();
  });
  
  test('user can add a todo', () => {
    render(<App persistence={new LocalStoragePersistenceAdapter()} idGen={idGeneratorAdapter} />);
    
    fireEvent.click(screen.getByText(/Add/i));
    const inputElement = screen.getByTestId("todo-input")
    userEvent.type(inputElement, "test todo");
    fireEvent.click(screen.getByTestId("todo-submit"));

    const todoText = screen.getByText(/test todo/i);
  
    expect(todoText).toBeInTheDocument();
  });

  test.only('user can see todos after refresh',async () => {
    const persistence = new LocalStoragePersistenceAdapter();
    render(<App persistence={persistence} idGen={idGeneratorAdapter} />);
    await sleep(1000)
    
    fireEvent.click(screen.getByText(/Add/i));
    const inputElement = screen.getByTestId("todo-input")
    userEvent.type(inputElement, "test todo");
    fireEvent.click(screen.getByTestId("todo-submit"));

    cleanup();
    render(<App persistence={persistence} idGen={idGeneratorAdapter} />);
    await sleep(1000)
    expect(() => screen.getByText(/test todo/i)).not.toThrow();
  });

  
  const sleep = (ms: number ) => new Promise(resolve => setTimeout(resolve, ms));
  
  test('user can delete todo',async () => {
    const persistence = new LocalStoragePersistenceAdapter();
    render(<App persistence={persistence} idGen={idGeneratorAdapter} />);

    fireEvent.click(screen.getByText(/Add/i));
    const inputElement = screen.getByTestId("todo-input")
    userEvent.type(inputElement, "test todo");
    fireEvent.click(screen.getByTestId("todo-submit"));
    fireEvent.click(screen.getByTestId("delete-todo"));

    expect(() => screen.getByText(/test todo/i)).toThrow()
  });

  test('User gets an onboarding todo on first open',async () => {
    const persistence = new LocalStoragePersistenceAdapter();
    render(<App persistence={persistence} idGen={idGeneratorAdapter} />);

    const todoText = await waitFor(() => screen.getByText(/Welcome to todo-app/i));  
    expect(todoText).toBeInTheDocument();
  });

});
