import styled from 'styled-components';

export const Grid = styled.div`
    display: grid;
    gap: 2px;
    width: min-content;

    ${({ x = 0 }) => `
        ${x > 0 ? `grid-template-columns: repeat(${x}, auto);` : ''}
    `};
`;