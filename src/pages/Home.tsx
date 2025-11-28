import React from "react";
import { Link } from "react-router-dom";
import UserUpdater from "../components/UserUpdater";

const Home: React.FC = () => {
  return (
    <div>
        <UserUpdater />
      <h1>Home Page</h1>
      <Link to="/tree">Go to SRASM Tree Page</Link>
    </div>
  );
};

export default Home;
