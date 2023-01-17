import React, { useState } from "react";
import { dbService } from "fbase";
import { doc, deleteDoc, updateDoc } from "firebase/firestore";
import { async } from "@firebase/util";

const Nweet = ({ nweetObj, isOwner }) => {
  const [editing, setEditing] = useState(false);
  const [newNweet, setNewNweet] = useState(nweetObj.text);

  // DELETE
  const onDeleteClick = async () => {
    const ok = window.confirm("Are you sre you want to delete?");
    const NweetTextRef = doc(dbService, "nweets", `${nweetObj.id}`);
    if (ok) {
      await deleteDoc(NweetTextRef);
    }
  };

  // Edit
  const toggleEditing = () => {
    setEditing((prev) => !prev);
  };

  // UPDATE
  const onSubmit = async (event) => {
    event.preventDefault();

    const NweetTextRef = doc(dbService, "nweets", `${nweetObj.id}`);
    await updateDoc(NweetTextRef, {
      text: newNweet,
    });

    setEditing(false);
  };

  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setNewNweet(value);
  };

  return (
    <div>
      {editing ? (
        <>
          {isOwner && (
            <>
              <form onSubmit={onSubmit}>
                <input
                  type="text"
                  placeholder="Edit your nweets"
                  value={newNweet}
                  onChange={onChange}
                  required
                />
                <input type="submit" value="Update Nweet" />
              </form>
              <button onClick={toggleEditing}>Cancel</button>
            </>
          )}
        </>
      ) : (
        <>
          <h4>{nweetObj.text}</h4>
          {isOwner && (
            <>
              <button onClick={onDeleteClick}>Delete Nweet</button>
              <button onClick={toggleEditing}>Edit Nweet</button>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Nweet;
