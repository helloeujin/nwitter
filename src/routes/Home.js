import React, { useEffect, useState } from "react";
import { dbService, storageService } from "fbase";
import {
  addDoc,
  collection,
  serverTimestamp,
  getDocs,
  query,
  onSnapshot,
  orderBy,
  doc,
} from "firebase/firestore";
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import Nweet from "components/Nweet";
import { v4 as uuidv4 } from "uuid";

const Home = ({ userObj }) => {
  const [nweet, setNweet] = useState("");
  const [nweets, setNweets] = useState([]);
  const [attachment, setAttachment] = useState();

  // // READ (not realtime)
  // const getNweets = async () => {
  //   const dbNweets = await getDocs(collection(dbService, "nweets"));
  //   dbNweets.forEach((document) => {
  //     const nweetObject = {
  //       ...document.data(),
  //       id: document.id,
  //     };
  //     console.log(nweetObject);
  //     setNweets((prev) => [nweetObject, ...prev]);
  //   });
  // };

  // READ (realtime, onSnaptshot)
  useEffect(() => {
    const q = query(collection(dbService, "nweets"), orderBy("createdAt"));
    onSnapshot(q, (snapshot) => {
      const nweetArray = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setNweets(nweetArray);
    });
  }, []);

  // ADD
  const onSubmit = async (event) => {
    event.preventDefault();

    let attachmentUrl = "";
    if (attachment != "") {
      const attachmentRef = ref(storageService, `${userObj.uid}/${uuidv4()}`);
      // upload to firebase storage
      const response = await uploadString(
        attachmentRef,
        attachment,
        "data_url"
      );
      // get file url from firebase firestore database
      attachmentUrl = await getDownloadURL(response.ref);
    }

    const nweetObj = {
      text: nweet,
      createdAt: Date.now(),
      creatorId: userObj.uid,
      attachmentUrl,
    };

    // add data to firebase
    await addDoc(collection(dbService, "nweets"), nweetObj);
    setNweet("");
    setAttachment("");
  };

  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setNweet(value);
  };

  // Attach image
  const onFileChange = (event) => {
    // file
    const {
      target: { files },
    } = event;
    const theFile = files[0];

    // file reader
    const reader = new FileReader();
    reader.onloadend = (finishedEvent) => {
      const {
        currentTarget: { result },
      } = finishedEvent;
      setAttachment(result);
    };
    reader.readAsDataURL(theFile);
  };

  const onClearAttachment = () => setAttachment(null);

  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          value={nweet}
          onChange={onChange}
          type="text"
          placeholder="What's on your mind?"
          maxLength={120}
        />
        <input type="file" accept="image/*" onChange={onFileChange} />
        <input type="submit" value="Nweet" />
        {attachment && (
          <div>
            <img src={attachment} width="50px" height="50px" />
            <button onClick={onClearAttachment}>Clear</button>
          </div>
        )}
      </form>

      <div>
        {nweets.map((nweet) => (
          <Nweet
            key={nweet.id}
            nweetObj={nweet}
            isOwner={nweet.creatorId === userObj.uid}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;
