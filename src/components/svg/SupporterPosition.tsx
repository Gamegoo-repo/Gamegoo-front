interface SvgProps {
  currentColor: string;
  width: string;
  height: string;
}
const SupporterSvg = (props: SvgProps) => {
  const { currentColor, width, height } = props;

  return (
    <svg width={width} height={height} viewBox="0 0 36 30" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M13.9854 3.70326V0.882812H22.4238V3.70326L18.2046 7.93393L13.9854 3.70326Z" fill={currentColor} />
      <path d="M22.4238 25.5622L20.3176 13.2423C20.1415 12.2128 19.2491 11.46 18.2046 11.46C17.1601 11.46 16.2676 12.2128 16.0916 13.2423L13.9854 25.5622L18.2046 29.0877L22.4238 25.5622Z" fill={currentColor} />
      <path d="M20.0132 9.69743L24.2324 6.17188H35.6847C32.7915 9.46239 27.648 10.285 25.4379 10.285L28.4517 14.3982L23.6297 17.3361L20.0132 9.69743Z" fill={currentColor} />
      <path d="M16.396 9.69743L12.1768 6.17188H0.724523C3.61772 9.46239 8.76118 10.285 10.9713 10.285L7.95751 14.3982L12.7795 17.3361L16.396 9.69743Z" fill={currentColor} />
    </svg>
  )
};

export default SupporterSvg;