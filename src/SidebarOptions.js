import { MdCompareArrows } from "react-icons/md";
import { ImMap, ImStatsDots } from "react-icons/im";
import { GiPlayerTime } from "react-icons/gi";
import { RiLoginBoxFill } from "react-icons/ri";

const ICON_SIZE = 40;

export const options = [
  {
    id: "1",
    icon: <ImMap size={ICON_SIZE} />,
    label: "map",
    path: "/",
  },
  {
    id: "2",
    icon: <ImStatsDots size={ICON_SIZE} />,
    label: "statistics",
    path: "/statistics",
  },
  {
    id: "3",
    icon: <MdCompareArrows size={ICON_SIZE} />,
    label: "compare",
    path: "/compare",
  },
  {
    id: "4",
    icon: <GiPlayerTime size={ICON_SIZE} />,
    label: "simulate",
    path: "/simulate",
  },
  {
    id: "5",
    icon: <RiLoginBoxFill size={ICON_SIZE} />,
    label: "login",
    path: "/",
  },
];
