import styled from 'styled-components';

export type ProgressBarProps = { progress: number };

export const ProgressBar = styled.div<ProgressBarProps>`
  margin-top: 10px;
  position: relative;
  width: 330px;
  height: 8px;
  border-radius: 5px;
  background: #1e1e24;
  box-shadow: inset 0px 0px 8px rgba(0, 0, 0, 0.6);

  &::before {
    content: '';
    position: absolute;
    top: 1px;
    left: 1px;
    width: ${props => props.progress}%;
    height: 6px;
    border-radius: 5px;
    background: #cc3333;
  }

  &::after {
    content: '${props => props.progress}%';
    position: absolute;
    top: -9px;
    left: 340px;
    color: #cc3333;
    font-family: Lato;
    font-size: 20px;
    font-weight: 600;
  }
`;
