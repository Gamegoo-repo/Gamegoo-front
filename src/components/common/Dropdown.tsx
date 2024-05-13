import Image from "next/image";
import { useState } from "react";
import styled from "styled-components";

const Dropdown = () => {

    const [isOpen, setIsOpen] = useState<boolean>(false);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const closeDropdown = () => {
        setIsOpen(false);
    };
    return (
        <div>
            <Button
                type="button"
                onClick={toggleDropdown}>
                Dropdown
                <Image
                    src='/assets/icons/down_arrow.svg'
                    width={16}
                    height={9}
                    alt='down arrow' />
            </Button>

            {isOpen && (
                <div>
                    <ul role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                        <li>
                            <a
                                href="#"
                                onClick={closeDropdown}
                            >
                                Option 1
                            </a>
                        </li>
                        <li>
                            <a
                                href="#"
                                onClick={closeDropdown}
                            >
                                Option 2
                            </a>
                        </li>
                        <li>
                            <a
                                href="#"
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                onClick={closeDropdown}
                            >
                                Option 3
                            </a>
                        </li>
                    </ul>
                </div>
            )}
        </div>
    )
};

export default Dropdown;

const Button = styled.button`
    border-radius: 10px;
`