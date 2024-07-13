import styled from 'styled-components';
import { theme } from "@/styles/theme";
import { Dispatch, SetStateAction, useEffect, useRef } from 'react';

interface ContextMenuProps {
    x: number;
    y: number;
    onClose: () => void;
    onDelete: () => void;
}

const DeleteFriend = ({ x, y, onClose, onDelete }: ContextMenuProps) => {
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [onClose]);


    return (
        <MenuContainer $top={y} $left={x} ref={menuRef}>
            <MenuItem onClick={(e) => { e.stopPropagation(); onDelete(); }}>삭제하기</MenuItem>
        </MenuContainer>
    );
};

export default DeleteFriend;

const MenuContainer = styled.div<{ $top: number, $left: number }>`
    position: absolute;
    top: ${(props) => props.$top}px;
    left: ${(props) => props.$left}px;
    z-index: 1000;
    max-width: 175px;
    width: 100%;
    background: ${theme.colors.white};
    color: #555555;  
    ${(props) => props.theme.fonts.medium15};
    border: 1px solid ${theme.colors.gray400};
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);
    border-radius: 10px;
    overflow: hidden;
    white-space: nowrap;
    box-sizing: border-box;
`;

const MenuItem = styled.div`
    padding: 11px 20px;
    cursor: pointer;
    pointer-events: auto;
`;