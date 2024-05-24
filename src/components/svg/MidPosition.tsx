interface SvgProps {
    currentColor1: string;
    currentColor2: string;
    width: string;
    height: string;
}
const MidSvg = (props: SvgProps) => {
    const { currentColor1, currentColor2, width, height } = props;

    return (
        <svg width={width} height={height} viewBox="0 0 27 26" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0.144531 19.2146V0.291992H19.5552L15.2417 4.49702H4.45802V15.0096L0.144531 19.2146Z" fill={currentColor1} />
            <path d="M26.1838 6.75438V25.677H7.24656L11.4548 21.472H21.9756V10.9594L26.1838 6.75438Z" fill={currentColor1} />
            <path d="M0.144531 21.4453L21.8435 0.291992H26.1833V4.52266L4.48432 25.676H0.144531V21.4453Z" fill={currentColor2} />
        </svg>

    )
};

export default MidSvg;