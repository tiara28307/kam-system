// @mui icons
import LinkedIn from "@mui/icons-material/LinkedIn";
import GitHubIcon from "@mui/icons-material/GitHub";

// Images
import logoCT from "assets/images/kam-favicon.png";

export default {
  brand: {
    name: "KAM System",
    image: logoCT,
    route: "/",
  },
  socials: [
    {
      icon: <LinkedIn />,
      link: "https://www.linkedin.com/in/ti-ara-carroll-623b00168/",
    },
    {
      icon: <GitHubIcon />,
      link: "https://github.com/tiara28307/kam-system",
    },
  ],
  menus: [
    {
      name: "resources",
      items: [
        { name: "contact", href: "https://www.creative-tim.com/contact-us" },
        { name: "white paper", href: "https://www.creative-tim.com/bits" },
      ],
    },
  ],
};
