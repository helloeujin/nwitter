import React, { useEffect, useState } from "react";
import { signOut } from "firebase/auth";
import { authService } from "fbase";
import { useHistory } from "react-router-dom";
import { dbService } from "fbase";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
} from "@firebase/firestore";
import { updateProfile } from "@firebase/auth";

const Profile = ({ userObj, refreshUser }) => {
  const history = useHistory();
  const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);

  // Log out
  const onLogOutClick = () => {
    signOut(authService);
    history.push("/");
  };

  // const getMyNweets = async () => {
  //   //// filtering with where
  //   const q = query(
  //     collection(dbService, "nweets"),
  //     where("creatorId", "==", userObj.uid)
  //     // orderBy("createdAt")
  //   );

  //   const querySnapshot = await getDocs(q);
  //   querySnapshot.forEach((doc) => {
  //     console.log(doc.id, " => ", doc.data());
  //   });
  // };

  // useEffect(() => {
  //   getMyNweets();
  // }, []);

  const onSubmit = async (event) => {
    event.preventDefault();
    if (userObj.displayName !== newDisplayName) {
      await updateProfile(authService.currentUser, {
        displayName: newDisplayName,
      });
    }
    // update name on the app
    refreshUser();
  };

  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setNewDisplayName(value);
  };

  return (
    <>
      <form onSubmit={onSubmit}>
        <input
          onChange={onChange}
          type="text"
          placeholder="Display name"
          value={newDisplayName}
        />
        <input type="submit" value="Update profile" />
      </form>
      <button onClick={onLogOutClick}>Log Out</button>
    </>
  );
};

export default Profile;
