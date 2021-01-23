import React, { useReducer } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Board from "./Board";
import Home from "./Home";
import HomeBoard from "./HomeBoard";
import NotFound from "./NotFound";
import AnonymousRoute from "./router/AnonymousRoute";
import ProtectedRoute from "./router/ProtectedRoute";
import LogIn from "./user/LogIn";
import SignUp from "./user/SignUp";
import { userReducer, UserContext, initial } from "./user/UserContext";

const App = () => {
  const [state, dispatch] = useReducer(userReducer, initial);

  return (
    <UserContext.Provider value={{ state, dispatch }}>
      <BrowserRouter>
        <Routes>
          <AnonymousRoute path="/login" element={<LogIn />} />
          <AnonymousRoute path="/signup" element={<SignUp />} />
          <ProtectedRoute path="/notes/:noteId" element={<Board />} />
          <ProtectedRoute path="/notes" element={<HomeBoard />} />
          <Route path="/" element={<Home />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </UserContext.Provider>
  );
};

export default App;
