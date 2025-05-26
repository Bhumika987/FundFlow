import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  colors: {
    brand: {
      50: "#e0f7ff",
      100: "#b8e9ff",
      200: "#8adaff",
      300: "#5ccbff",
      400: "#33bfff",
      500: "#1aa6e6",
      600: "#0081b4",
      700: "#005d82",
      800: "#003851",
      900: "#001521",
    },
  },
  fonts: {
    heading: "'Poppins', sans-serif",
    body: "'Inter', sans-serif",
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: "semibold",
        borderRadius: "xl",
      },
      variants: {
        solid: {
          bg: "brand.500",
          color: "white",
          _hover: {
            bg: "brand.600",
          },
        },
      },
    },
    Progress: {
      baseStyle: {
        filledTrack: {
          borderRadius: "full",
        },
      },
    },
  },
  config: {
    initialColorMode: "light",
    useSystemColorMode: false,
  },
});

export default theme;