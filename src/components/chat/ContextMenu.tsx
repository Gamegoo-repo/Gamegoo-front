import styled from 'styled-components';
import { theme } from "@/styles/theme";
import { Dispatch, SetStateAction, useEffect, useRef } from 'react';

interface ContextMenuProps {
    x: number;
    y: number;
    onClose: () => void;
    onDelete: () => void;
}

const ContextMenu = ({ x, y, onClose, onDelete }: ContextMenuProps) => {
    const menuRef = useRef<HTMLDivElement>(null);
    // useEffect(() => {
    //     const handleClickOutside = (event: MouseEvent) => {
    //         if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
    //             onClose();
    //         }
    //     };

    //     document.addEventListener('click', handleClickOutside);
    //     return () => {
    //         document.removeEventListener('click', handleClickOutside);
    //     };
    // }, [onClose]);

    return (
        <MenuContainer $top={y} $left={x}>
            {/* <MenuItem onClick={onDelete}>삭제하기</MenuItem> */}
            <MenuItem>삭제하기</MenuItem>
        </MenuContainer>
    );
};

export default ContextMenu;

const MenuContainer = styled.div<{ $top: number, $left: number }>`
    position: fixed;
    /* position:absolute; */
    top: ${(props) => props.$top};
    left: ${(props) => props.$left};
    z-index: 1000;
    background: ${theme.colors.white};
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);
    border-radius: 4px;
    overflow: hidden;
    white-space: nowrap;
    box-sizing: border-box;
`;

const MenuItem = styled.div`
    padding: 8px 16px;
    cursor: pointer;
    &:hover {
        background: ${theme.colors.gray200};
    }
`;