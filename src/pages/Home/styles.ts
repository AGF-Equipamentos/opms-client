import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  width: 100%;
  flex-direction: row;
  align-items: center;
  background: ${props => props.theme.colors.background};
  margin-bottom: 32px;
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  span {
    width: 20px;
  }

  svg {
    cursor: pointer;
  }

  h1 {
    display: flex;
    margin: 0;

    h2 {
      margin: 0;
      font-size: 54px;
    }

    img {
      width: 100px;
      margin-right: 8px;
    }

    strong {
      font-size: 82px;
      color: ${props => props.theme.colors.primary};
    }
  }
`;
