import React, { useEffect } from "react";
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

const Profile = ({ userObj }) => {
  const history = useHistory();

  // Log out
  const onLogOutClick = () => {
    signOut(authService);
    history.push("/");
  };

  const getMyNweets = async () => {
    // filtering with where
    // const q = query(collection(dbService, "nweets"), orderBy("createdAt"));
    const q = query(
      collection(dbService, "nweets"),
      where("creatorId", "==", userObj.uid)
      // orderBy("createdAt")
    );

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      console.log(doc.id, " => ", doc.data());
    });
  };

  useEffect(() => {
    getMyNweets();
  }, []);

  return <button onClick={onLogOutClick}>Log Out</button>;
};

export default Profile;
