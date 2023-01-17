import { useEffect, useState } from "react";
import AppRouter from "components/Router";
import { authService } from "fbase";
import { onAuthStateChanged } from "firebase/auth";

function App() {
  const [init, setInit] = useState(false);
  const [userObj, setUserObj] = useState(null);

  // Observer to notice changes on the user's sign-in state, event listener
  useEffect(() => {
    onAuthStateChanged(authService, (user) => {
      if (user) {
        // make obj smaller so react can notice the change
        setUserObj({
          displayName: user.displayName,
          uid: user.uid,
          // updateProfile: (args) =>
          //   user.updateProfile(user, { displayName: user.displayName }),
        });
      }
      setInit(true);
    });
  }, []);

  const refreshUser = () => {
    const user = authService.currentUser;
    setUserObj({
      displayName: user.displayName,
      uid: user.uid,
      // updateProfile: (args) =>
      //   user.updateProfile(user, { displayName: user.displayName }),
    });
  };

  return (
    <>
      {init ? (
        <AppRouter
          isLoggedIn={Boolean(userObj)}
          userObj={userObj}
          refreshUser={refreshUser}
        />
      ) : (
        "Initializing..."
      )}
    </>
  );
}

export default App;
