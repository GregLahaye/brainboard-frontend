import React, { useContext, useEffect, useState } from "react";
import Board from "./Board";
import { Network } from "./network/network";
import { UserContext } from "./user/UserContext";

const HomeBoard = () => {
  const { state } = useContext(UserContext);

  const [noteId, setNoteId] = useState<number>();

  const fetchId = async () => {
    const response = await Network.get("users/me", null, state.token);

    const user = await response.json();

    setNoteId(user.note.id);
  };

  useEffect(() => {
    fetchId();
  });

  return noteId ? <Board noteId={noteId} /> : null;
};

export default HomeBoard;
