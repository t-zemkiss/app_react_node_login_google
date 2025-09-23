import { useContext, useEffect } from "react";
import { AuthContext } from "../contexts/authContext";

const LandingPage = () => {
  const { user } = useContext(AuthContext);

  useEffect(() => {
    console.log("user en home", user);
  }, []);

    useEffect(() => {
    console.log("user en home", user);
  }, [user]);

  return (
    <>
      <div className="pt-16">
        <h1>LandingPage {user.email}</h1>
      </div>
    </>
  );
};

export default LandingPage;
