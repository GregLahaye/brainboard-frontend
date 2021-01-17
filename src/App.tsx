import React from "react";
import { Route } from "react-router";
import { BrowserRouter, Routes } from "react-router-dom";
import "./App.css";
import Board from "./Board";
import HomeBoard from "./HomeBoard";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/notes/:noteId" element={<Board />}></Route>
        <Route path="/notes" element={<HomeBoard />}></Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
