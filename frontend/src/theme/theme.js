import colors from "./colors";
import colorModeConfig from "./colorMode";
import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  config: colorModeConfig,
  colors,
})

export default theme;