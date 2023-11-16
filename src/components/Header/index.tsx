import { Button } from "@nextui-org/react";
import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

const Wrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  height: 90px;
  width: 100%;
  padding: 0 54px 0 60px;
  border-bottom: 2px solid #313538;
  z-index: 99;
  background-color: white;
  display: flex;
  align-items: center;
`;
const PageLink = styled(Link)``;

const Header: React.FC = () => {
  return (
    <Wrapper>
      <div className="mr-8 flex flex-wrap items-center gap-4">
        <Button color="primary" variant="bordered">
          <PageLink to="/profile">登入</PageLink>
        </Button>
      </div>
      <div className="flex flex-wrap items-center gap-4">
        <Button color="primary" variant="bordered">
          <PageLink to="/post">社群</PageLink>
        </Button>
      </div>
    </Wrapper>
  );
};

export default Header;
