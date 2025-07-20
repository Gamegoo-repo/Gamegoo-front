import "styled-components";

import type { BreakpointsTypes, ColorsTypes, FontsTypes } from "./theme";

declare module "styled-components" {
  export interface DefaultTheme {
    colors: ColorsTypes;
    fonts: FontsTypes;
    icon: typeof icon;
    breakpoints: BreakpointsType;
  }
}
