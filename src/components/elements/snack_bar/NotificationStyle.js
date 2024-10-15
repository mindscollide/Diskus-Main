import { makeStyles } from "@mui/styles";
export const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    "& > * + *": {
      marginTop: theme.spacing(10),
    },
  },
  BackGroundSucces: {
    width: "100%",
    backgroundColor: "#6172d6",
    marginTop: theme.spacing(8),
  },
  BackGroundfailed: {
    width: "100%",
    backgroundColor: "#ce0000",
    marginTop: theme.spacing(8),
  },
}));
