import { makeStyles } from "@material-ui/core/styles";
export const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    "& > * + *": {
      marginTop: theme.spacing(10),
    },
  },
  BackGroundSucces: {
    width: "100%",
    backgroundColor: "#076db7",
    marginTop: theme.spacing(8),
  },
  BackGroundfailed: {
    width: "100%",
    backgroundColor: "#ce0000",
    marginTop: theme.spacing(8),
  },
}));
