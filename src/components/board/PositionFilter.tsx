import styled from "styled-components";

import { theme } from "@/styles/theme";
import { trackButtonClick } from "@/utils/analytics";

import All from "../../../public/assets/images/position/default/default_all.svg";
import Jungle from "../../../public/assets/images/position/default/default_jungle.svg";
import Mid from "../../../public/assets/images/position/default/default_mid.svg";
import OneDeal from "../../../public/assets/images/position/default/default_one_deal.svg";
import Supporter from "../../../public/assets/images/position/default/default_supporter.svg";
import Top from "../../../public/assets/images/position/default/default_top.svg";

import type { Position } from "@/types";

interface SvgProps {
  onPositionFilter: (position: Position) => void;
  isPosition: Position;
}

const PositionFilter = (props: SvgProps) => {
  const { onPositionFilter, isPosition } = props;

  return (
    <Wrapper>
      <AllButton
        onClick={() => {
          trackButtonClick("전체 포지션", "board", "main", { position: "ANY" });
          onPositionFilter("ANY");
        }}
        className={isPosition === "ANY" ? "clicked" : ""}
      >
        <All />
      </AllButton>
      <TopButton
        onClick={() => {
          trackButtonClick("탑 포지션", "board", "main", { position: "TOP" });
          onPositionFilter("TOP");
        }}
        className={isPosition === "TOP" ? "clicked" : ""}
      >
        <Top />
      </TopButton>
      <JungleButton
        onClick={() => {
          trackButtonClick("정글 포지션", "board", "main", { position: "JUNGLE" });
          onPositionFilter("JUNGLE");
        }}
        className={isPosition === "JUNGLE" ? "clicked" : ""}
      >
        <Jungle />
      </JungleButton>
      <MidButton
        onClick={() => {
          trackButtonClick("미드 포지션", "board", "main", { position: "MID" });
          onPositionFilter("MID");
        }}
        className={isPosition === "MID" ? "clicked" : ""}
      >
        <Mid />
      </MidButton>
      <OneDealButton
        onClick={() => {
          trackButtonClick("ADC 포지션", "board", "main", { position: "ADC" });
          onPositionFilter("ADC");
        }}
        className={isPosition === "ADC" ? "clicked" : ""}
      >
        <OneDeal />
      </OneDealButton>
      <SupporterButton
        onClick={() => {
          trackButtonClick("서포터 포지션", "board", "main", { position: "SUP" });
          onPositionFilter("SUP");
        }}
        className={isPosition === "SUP" ? "clicked" : ""}
      >
        <Supporter />
      </SupporterButton>
    </Wrapper>
  );
};

export default PositionFilter;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
`;

const AllButton = styled.button`
  width: 46px;
  height: 56px;
  padding: 16px 11px;
  border-right: 1px solid ${theme.colors.gray300};
  border-radius: 10px 0 0 10px;

  &:hover {
    background: ${theme.colors.gray400};

    path {
      stroke: ${theme.colors.white};
    }
  }

  &.clicked {
    background: ${theme.colors.gray700};

    path {
      stroke: ${theme.colors.white};
    }
  }
  @media (max-width: ${theme.breakpoints.mobile}) {
    width: 42px;
    height: 44px;
    padding: 10px;
  }
`;

const TopButton = styled.button`
  width: 46px;
  height: 56px;
  padding: 16px 11px;
  border-right: 1px solid ${theme.colors.gray300};

  &:hover {
    background: ${theme.colors.gray400};

    path:first-child {
      fill: ${theme.colors.white};
    }
    path:nth-child(2) {
      fill: ${theme.colors.white};
    }
    path:nth-child(3) {
      fill: ${theme.colors.white};
    }
  }

  &.clicked {
    background: ${theme.colors.gray700};

    path:first-child {
      fill: ${theme.colors.white};
    }
  }
  @media (max-width: ${theme.breakpoints.mobile}) {
    width: 42px;
    height: 44px;
    padding: 10px;
  }
`;

const JungleButton = styled.button`
  width: 46px;
  height: 56px;
  padding: 16px 11px;
  border-right: 1px solid ${theme.colors.gray300};

  &:hover {
    background: ${theme.colors.gray400};

    path {
      fill: ${theme.colors.white};
    }
  }

  &.clicked {
    background: ${theme.colors.gray700};

    path {
      fill: ${theme.colors.white};
    }
  }
  @media (max-width: ${theme.breakpoints.mobile}) {
    width: 42px;
    height: 44px;
    padding: 10px;
  }
`;

const MidButton = styled.button`
  width: 46px;
  height: 56px;
  padding: 16px 11px;
  border-right: 1px solid ${theme.colors.gray300};

  &:hover {
    background: ${theme.colors.gray400};

    path:first-child {
      fill: ${theme.colors.white};
    }
    path:nth-child(2) {
      fill: ${theme.colors.white};
    }
    path:nth-child(3) {
      fill: ${theme.colors.white};
    }
  }

  &.clicked {
    background: ${theme.colors.gray700};

    path:nth-child(2) {
      fill: ${theme.colors.white};
    }
  }
  @media (max-width: ${theme.breakpoints.mobile}) {
    width: 42px;
    height: 44px;
    padding: 10px;
  }
`;

const OneDealButton = styled.button`
  width: 46px;
  height: 56px;
  padding: 16px 11px;
  border-right: 1px solid ${theme.colors.gray300};

  &:hover {
    background: ${theme.colors.gray400};

    path:first-child {
      fill: ${theme.colors.white};
    }
    path:nth-child(2) {
      fill: ${theme.colors.white};
    }
    path:nth-child(3) {
      fill: ${theme.colors.white};
    }
  }

  &.clicked {
    background: ${theme.colors.gray700};

    path:nth-child(2) {
      fill: ${theme.colors.white};
    }
  }
  @media (max-width: ${theme.breakpoints.mobile}) {
    width: 42px;
    height: 44px;
    padding: 10px;
  }
`;

const SupporterButton = styled.button`
  width: 46px;
  height: 56px;
  padding: 16px 11px;
  border-radius: 0 10px 10px 0;

  &:hover {
    background: ${theme.colors.gray400};

    path {
      fill: ${theme.colors.white};
    }
  }

  &.clicked {
    background: ${theme.colors.gray700};

    path {
      fill: ${theme.colors.white};
    }
  }
  @media (max-width: ${theme.breakpoints.mobile}) {
    width: 42px;
    height: 44px;
    padding: 10px;
  }
`;
