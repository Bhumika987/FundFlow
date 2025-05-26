import { theme } from "./theme";

type Theme = typeof theme;

declare module "@chakra-ui/react" {
  interface Theme extends Theme {}
}