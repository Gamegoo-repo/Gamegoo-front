interface SvgProps {
    currentColor1: string;
    currentColor2: string;
    width: string;
    height: string;
}
const BotSvg = (props: SvgProps) => {
    const { currentColor1, currentColor2, width, height } = props;

    return (
        <svg width={width} height={height} viewBox="0 0 27 26" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0.5625 22.8556V0.291992H23.7081L19.3683 4.52266H4.90229V18.6249L0.5625 22.8556Z" fill={currentColor1} />
            <path d="M26.6018 3.11344V25.677H3.45624L7.79604 21.4463H22.262V7.3441L26.6018 3.11344Z" fill={currentColor2} />
            <rect x="9.24194" y="8.75293" width="8.67959" height="8.46134" fill={currentColor2} />
        </svg>
    )
};

export default BotSvg;