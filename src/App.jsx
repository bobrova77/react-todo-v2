import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import TodoList from "./components/TodoList";
import AddTodoForm from "./components/AddTodoForm";
import style from "./components/TodoListItem.module.css";
import "./components/App.css";

function App() {
  const [todoList, setTodoList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortAscending, setSortAscending] = useState(true);

  const sortedTodos = todoList.sort((a, b) =>
    sortAscending
      ? new Date(a.createdTime) - new Date(b.createdTime)
      : new Date(b.createdTime) - new Date(a.createdTime)
  );

  async function fetchData() {
    const options = {};
    options.method = "GET";
    options.headers = {
      Authorization: `Bearer ${process.env.REACT_APP_AIRTABLE_API_KEY}`,
    };
    const url = `https://api.airtable.com/v0/${process.env.REACT_APP_AIRTABLE_BASE_ID}/${process.env.REACT_APP_TABLE_NAME}`;

    try {
      const response = await fetch(url, options);

      console.log(response);

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();

      const todos = data.records.map((todo) => ({
        id: todo.id,
        title: todo.fields.title,
        createdTime: todo.createdTime,
      }));

      setTodoList(todos);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setIsLoading(false);
  }

  useEffect(() => {
    fetchData();
  }, []);

  async function addTodo(newTodo) {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.REACT_APP_AIRTABLE_API_KEY}`,
      },
      body: JSON.stringify({
        fields: {
          title: newTodo.title,
        },
      }),
    };

    try {
      const response = await fetch(
        `https://api.airtable.com/v0/${process.env.REACT_APP_AIRTABLE_BASE_ID}/${process.env.REACT_APP_TABLE_NAME}`,
        options
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const todo = await response.json();

      const updatedTodo = {
        id: todo.id,
        title: todo.fields.title,
        createdTime: todo.createdTime,
      };

      setTodoList([...todoList, updatedTodo]);
    } catch (error) {
      console.error("Error adding todo:", error);
    }
  }

  function toggleSortOrder() {
    setSortAscending((prevSortOrder) => !prevSortOrder);
  }

  async function removeTodo(id) {
    const options = {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${process.env.REACT_APP_AIRTABLE_API_KEY}`,
      },
    };

    try {
      const response = await fetch(
        `https://api.airtable.com/v0/${process.env.REACT_APP_AIRTABLE_BASE_ID}/${process.env.REACT_APP_TABLE_NAME}/${id}`,
        options
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      setTodoList((prevTodoList) =>
        prevTodoList.filter((item) => item.id !== id)
      );
    } catch (error) {
      console.error("Error removing todo:", error);
    }
  }

  console.log(sortAscending);
  console.log(sortedTodos);

  async function updateTodoTitle(todoId, newTitle) {
    const updatedTodoList = todoList.map((todo) =>
      todo.id === todoId ? { ...todo, title: newTitle } : todo
    );
    setTodoList(updatedTodoList);
  }

  return (
    <BrowserRouter>
      <div className="App-content">
        <h1 className="App-heading">
          YOUR FAVORITE <br></br> To-Do List:
        </h1>
        <button
          className={`ToggleButton ${style.toggleButton}`}
          onClick={toggleSortOrder}
        >
          Toggle Sort : &nbsp; &nbsp;
          {sortAscending ? " Ascending ⬆️" : " Descending ⬇️ "}
        </button>
        <Routes>
          <Route
            path="/"
            element={
              isLoading ? (
                <p>Loading...</p>
              ) : (
                <>
                  <AddTodoForm onAddTodo={addTodo} />
                  <TodoList
                    todoList={sortedTodos}
                    onRemoveTodo={removeTodo}
                    onUpdateTodoTitle={updateTodoTitle}
                  />
                </>
              )
            }
          />
          <Route path="/new" element={<h1>New Todo List</h1>} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
