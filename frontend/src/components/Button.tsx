import styled from 'styled-components';

export const Button = styled.button`
  position: absolute;
  right: 23px;
  bottom: 25px;
  background: #cc3333;
  padding: 8px 21px;
  border: 0;
  border-radius: 4px;
  font-family: Lato;
  font-size: 16px;
  color: #fff;
  -webkit-app-region: no-drag; /* Necessary to maintain button clickable 
                                  when all the window is draggable */
`;
