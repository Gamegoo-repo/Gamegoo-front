interface SvgProps {
    currentColor1: string;
    currentColor2: string;
    width: string;
    height: string;
}
const TopSvg = (props: SvgProps) => {
    const { currentColor1, currentColor2, width, height } = props;

    return (
        <svg width={width} height={height} viewBox="0 0 27 26" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0.601807 22.8556V0.291992H23.7474L19.4076 4.52266H4.9416V18.6249L0.601807 22.8556Z" fill={currentColor1} />
            <path d="M26.6411 3.11344V25.677H3.49555L7.83534 21.4463H22.3013V7.3441L26.6411 3.11344Z" fill={currentColor2} />
            <rect x="9.28125" y="8.75293" width="8.67959" height="8.46134" fill={currentColor1} />
        </svg>
    )
};

export default TopSvg;