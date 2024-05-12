import { theme } from "@/styles/theme";
import Image from "next/image";
import Link from "next/link";
import styled from "styled-components";

interface GraphicBoxProps {
    href: string;
    children: string;
}

const GraphicBox = (props: GraphicBoxProps) => {
    const { href, children } = props;
    
    return (
        <>
            <Link href={href}>
                <Image
                    src='/assets/icons/logo.svg'
                    width={371}
                    height={117}
                    alt='logo' />
                <h1>{children}</h1>
            </Link>
        </>
    )
}

export default GraphicBox;