interface SvgProps {
    currentColor: string;
    width: string;
    height: string;
}
const JungleSvg = (props: SvgProps) => {
    const { currentColor, width, height } = props;

    return (
        <svg width={width} height={height} viewBox="0 0 31 30" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16.5532 29.3793C18.8678 17.5334 13.66 4.70039 7.15031 0.469727C10.0435 5.54653 10.7668 12.4566 10.7668 15.2771C7.87361 10.2003 2.81052 7.99091 0.640625 7.52084C3.53382 9.7772 5.22152 13.6318 5.70372 15.2771C6.86099 24.8666 13.4189 28.6742 16.5532 29.3793Z" fill={currentColor} />
            <path d="M18.7231 17.3924L17.2765 11.7515C18.7231 7.52084 21.6163 2.58506 25.2328 0.469727C21.1823 6.67471 23.0629 11.7515 18.7231 17.3924Z" fill={currentColor} />
            <path d="M19.4464 26.5588V20.918C20.8627 14.705 27.1319 9.39322 30.1092 7.62927C30.1756 7.58505 30.238 7.54905 30.2959 7.52084C30.2352 7.55534 30.173 7.59149 30.1092 7.62927C29.069 8.32179 27.0439 11.0296 25.9561 17.3924C24.7988 24.1615 20.893 26.3238 19.4464 26.5588Z" fill={currentColor} />
        </svg>
    )
};

export default JungleSvg;