import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import Board from "./Board";

const HomeBoard = () => {
  const [noteId, setNoteId] = useState<number>();

  const fetchId = async () => {
    const url = "http://localhost:8000/users/me/";

    const headers = new Headers();
    headers.append("Authorization", `Bearer ${process.env.REACT_APP_TOKEN}`);

    const response = await fetch(url, { headers });

    const user = await response.json();

    setNoteId(user.note.id);
  };

  useEffect(() => {
    fetchId();
  });

  return noteId ? <Board noteId={noteId} /> : null;
};

export default HomeBoard;
