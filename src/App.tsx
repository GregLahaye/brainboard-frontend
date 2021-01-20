import React, { useReducer } from "react";
import { Route } from "react-router";
import { BrowserRouter, Routes } from "react-router-dom";
import "./App.css";
import Board from "./Board";
import HomeBoard from "./HomeBoard";
import LogIn from "./user/LogIn";
import SignUp from "./user/SignUp";
import { userReducer, UserContext, initial } from "./user/UserContext";

const App = () => {
  const [state, dispatch] = useReducer(userReducer, initial);

  return (
    <UserContext.Provider value={{ state, dispatch }}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LogIn />}></Route>
          <Route path="/signup" element={<SignUp />}></Route>
          <Route path="/notes/:noteId" element={<Board />}></Route>
          <Route path="/notes" element={<HomeBoard />}></Route>
        </Routes>
      </BrowserRouter>
    </UserContext.Provider>
  );
};

export default App;
