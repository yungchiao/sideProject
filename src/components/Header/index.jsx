import { Button } from "@nextui-org/react";
import { Link } from "react-router-dom";
import styled from "styled-components";

const Wrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  height: 140px;
  width: 100%;
  padding: 0 54px 0 60px;
  border-bottom: 2px solid #313538;
  // box-shadow: 2px 2px 3px 2px rgba(0, 0, 0, 0.2);
  z-index: 99;
  background-color: white;
  display: flex;
  align-items: center;
`;
const PageLink = styled(Link)``;

function Header() {
  return (
    <Wrapper>
      <div className="flex flex-wrap items-center gap-4">
        <Button color="primary" variant="bordered">
          <PageLink to="/profile">登入</PageLink>
        </Button>
      </div>
    </Wrapper>
  );
}

export default Header;
