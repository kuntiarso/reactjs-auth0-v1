import React, { useState } from "react";
import styled from "styled-components";
import { useAuth0 } from "@auth0/auth0-react";
import JSONPretty from "react-json-pretty";
import axios from "axios";

// ---------------------------------------- styles

const Container = styled.div`
  width: 100%;
  padding: 2rem 0;
  font-size: 18px;
  font-weight: 700;
  text-align: center;
`;

const Actions = styled.div`
  display: flex;
  justify-content: center;
`;

const Button = styled.span`
  color: #fff;
  cursor: pointer;
  margin: 2rem 1rem;
  padding: 8px 32px;
  border-radius: 6px;
  background-color: #5b4b8a;
  &:hover {
    background-color: #4c3575;
  }
`;

const Contents = styled.div`
  margin-top: 2rem;
  color: royalblue;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const Data = styled.div`
  margin-top: 2rem;
  font-size: 14px;
  font-weight: 450;
  text-align: left;
  display: flex;
  justify-content: center;
`;

// ---------------------------------------- components

const App = () => {
  const {
    loginWithPopup,
    logout,
    user,
    isAuthenticated,
    isLoading,
    error,
    getAccessTokenSilently,
  } = useAuth0();

  const [dataAPI, setDataAPI] = useState({});

  const getPublicAPI = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/public");
      setDataAPI(res.data);
    } catch (error) {
      setDataAPI(error.message);
    }
  };

  const getPrivateAPI = async () => {
    try {
      const token = await getAccessTokenSilently();
      const headers = { authorization: `Bearer ${token}` };
      const res = await axios.get("http://localhost:5000/api/private", {
        headers,
      });
      setDataAPI(res.data);
    } catch (error) {
      setDataAPI(error.message);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Oops... {error.message}</div>;
  }

  return (
    <Container>
      <h2>
        <em>A React-App with Auth0</em>
      </h2>
      <Actions>
        <Button onClick={loginWithPopup}>Login</Button>
        <Button onClick={logout}>Logout</Button>
      </Actions>
      <Contents>
        <div>
          User is{" "}
          <em style={{ color: "salmon" }}>
            {isAuthenticated ? "Authenticated" : "Unauthenticated"}
          </em>
        </div>
        <Data>
          <span>
            <JSONPretty id="json-pretty-1" data={user} />
          </span>
        </Data>
      </Contents>
      <br />
      <Actions>
        <Button onClick={getPublicAPI}>Public API</Button>
        <Button onClick={getPrivateAPI}>Private API</Button>
      </Actions>
      <Contents>
        <div>Result Data</div>
        <Data>
          <span>
            <JSONPretty id="json-pretty-2" data={dataAPI} />
          </span>
        </Data>
      </Contents>
    </Container>
  );
};

export default App;
