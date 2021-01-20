import React, { useReducer } from "react";
import { Route } from "react-router";
import { BrowserRouter, Routes } from "react-router-dom";
import "./App.css";
import Board from "./Board";
import HomeBoard from "./HomeBoard";
import LogIn from "./user/LogIn";
import { userReducer, UserContext, unauthenticated } from "./user/UserContext";

const App = () => {
  const [state, dispatch] = useReducer(userReducer, unauthenticated);

  return (
    <UserContext.Provider value={{ state, dispatch }}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LogIn />}></Route>
          <Route path="/notes/:noteId" element={<Board />}></Route>
          <Route path="/notes" element={<HomeBoard />}></Route>
        </Routes>
      </BrowserRouter>
    </UserContext.Provider>
  );
};

export default App;
