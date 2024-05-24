interface SvgProps {
    currentColor: string;
    width: string;
    height: string
}

const RandomSvg = (props: SvgProps) => {
    const { currentColor, width, height } = props;

    return (
        <svg
            width={width} height={height} viewBox="0 0 24 21" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2 10.2585H21.8087" stroke={currentColor} strokeWidth="2.97087" strokeLinecap="round" />
            <path d="M6.9519 18.6211L16.8563 1.89758" stroke={currentColor} strokeWidth="2.97087"
                strokeLinecap="round" />
            <path d="M16.8569 18.6211L6.95256 1.89758" stroke={currentColor} strokeWidth="2.97087"
                strokeLinecap="round" />
        </svg>
    )
};

export default RandomSvg;

