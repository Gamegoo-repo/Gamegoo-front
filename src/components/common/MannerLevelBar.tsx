import { theme } from "@/styles/theme";
import Image from "next/image";
import styled from "styled-components";
import ChevronDownIcon from "../../../public/assets/icons/chevron_down.svg";

const levelColors = [
  theme.colors.purple400,
  theme.colors.purple300,
  theme.colors.purple200,
  theme.colors.purple100,
  theme.colors.gray700,
];

interface MannerLevelBarProps {
  recentLevel: number;
  percentage?: number;
}

const MannerLevelBar = (props: MannerLevelBarProps) => {
  const { recentLevel, percentage } = props;

  return (
    <Container>
      <Bar>
        <PurpleBar />
        <BlackBar />
      </Bar>
      <Check>
        {[1, 2, 3, 4, 5].map((level) => (
          <LevelBox key={level} level={level - 1}>
            {recentLevel === level && (
              <Recent>
                {percentage && (
                  <Percentage>{`상위 ${percentage}% 의 매너레벨`}</Percentage>
                )}
                <DownIconWrapper level={level - 1}>
                  <ChevronDownIcon />
                </DownIconWrapper>
              </Recent>
            )}
            <Level bold={recentLevel === level}>{`Lv ${level}`}</Level>
            <Image
              src={`/assets/icons/check_level${level}.svg`}
              alt={`check_level${level}`}
              width={level === 5 ? 17 : 39}
              height={level === 5 ? 17 : 39}
              style={{ marginBottom: level === 5 ? "9px" : undefined }}
            />
          </LevelBox>
        ))}
      </Check>
    </Container>
  );
};

export default MannerLevelBar;

const Container = styled.div`
  width: 100%;
  height: 90px;
  position: relative;
  display: flex;
  justify-content: flex-end;
`;

const Bar = styled.div`
  width: calc(100% - 25px);
  height: 3.8px;
  display: flex;
  align-items: center;
  position: absolute;
  bottom: 15px;
  left: 0;
`;

const PurpleBar = styled.div`
  width: 80%;
  height: 3.8px;
  background: linear-gradient(90deg, #dbd6fe 0%, #5a42ee 100%);
`;

const BlackBar = styled.div`
  width: 20%;
  height: 3.8px;
  background: #606060;
`;

const Check = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: absolute;
  bottom: 0;
  left: 0;
`;

const LevelBox = styled.div<{ level: number }>`
  display: flex;
  width: 39px;
  height: 100%;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  color: ${(props) => levelColors[props.level]};
  position: relative;
`;

const Recent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  margin-bottom: 3.5px;
  white-space: nowrap;
`;

const Percentage = styled.div`
  ${(props) => props.theme.fonts.bold11};
`;

const DownIconWrapper = styled.div<{ level: number }>`
  path {
    fill: ${(props) => levelColors[props.level]};
    transform: scale(1.42857);
  }
  svg {
    width: 10px;
    height: 10px;
  }
`;

const Level = styled.div<{ bold: boolean }>`
  ${(props) =>
    props.bold ? props.theme.fonts.bold14 : props.theme.fonts.regular14};
  margin-bottom: 12px;
`;
