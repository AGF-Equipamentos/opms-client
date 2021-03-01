import styled from 'styled-components';
import { shade } from 'polished';

export const Container = styled.button`
  background: ${props => props.theme.colors.primary};
  height: 56px;
  border-radius: 10px;
  border: 2px solid ${props => props.theme.colors.primary};
  padding: 0 16px;
  color: ${props => shade(0.2, props.theme.colors.backgroundLight)};
  width: 100%;
  font-weight: 500;
  margin-top: 16px;
  transition: background-color 0.4s;

  &:hover {
    background: ${props => shade(0.2, props.theme.colors.backgroundLight)};
    border: 2px solid ${props => props.theme.colors.primary};
    color: ${props => props.theme.colors.text};
  }
`;
