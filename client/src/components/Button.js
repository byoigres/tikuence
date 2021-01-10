import React from 'react';
import styled from 'styled-components';

const StyledButton = styled.button`
  background-color: #fff;
  border: 1px solid #b9b7b7;
  padding: 0.5rem 1rem;
  font-size: 0.8rem;
  font-weight: 400;
`;

function Button(props) {
  const { children, loading, ...rest } = props;
  return (
    <StyledButton {...rest}>
      {loading && <i>Loading...</i>}
      {!loading && children}
    </StyledButton>
  );
}

export default Button;
