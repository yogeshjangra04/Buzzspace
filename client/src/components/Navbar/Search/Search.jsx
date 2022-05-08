import { SearchRounded } from "@mui/icons-material";
import classes from "./Search.module.css";

const Search = () => {
  return (
    <div className={classes["navbar-search"]}>
      <SearchRounded className={classes["search-icon"]} />
      <input className={classes["search-input"]} type="text" />
    </div>
  );
};

export default Search;
