import { useSelector } from "react-redux";
import { useState, useEffect, isValidElement } from "react";
import classes from "./EditProfile.module.css";
import ppIcon from "../../images/pp-icon-biggest.png";
import coverImg from "../../images/gootalk-cover.jpg";
import {
  CountrySelector,
  CitySelector,
} from "../SignupForm/LocationSelector/LocationSelector";
import getLocations from "../../helpers/countries-api/getLocations";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useDispatch } from "react-redux";
import { userActions } from "../../store/user-slice";
import { CircularProgress } from "@mui/material";

const EditProfile = ({ onCloseEdit }) => {
  const user = useSelector((state) => state.user.user);
  const [countries, setCountries] = useState([]);
  const [countryFocus, setCountryFocus] = useState(false);
  const [countryObj, setCountryObj] = useState({});
  const [country, setCountry] = useState(user.country);
  // const [isEmptyCountries, setIsEmptyCountries] = useState(true)

  const [cityFocus, setCityFocus] = useState(false);
  const [city, setCity] = useState(user.city);

  const [updatedUser, setUpdatedUser] = useState({
    firstname: user.firstname,
    lastname: user.lastname,
    profilePicture: user.profilePicture,
    country: user.country,
    city: user.city,
  });

  const [isValid, setIsValid] = useState({ firstname: true, lastname: true });
  const [isLoading, setIsLoading] = useState(false);
  const [errMsg, setErrMsg] = useState({ code: null, msg: "" });
  const [successMsg, setSuccessMsg] = useState(false);
  const req = useAxiosPrivate();
  const dispatch = useDispatch();

  useEffect(() => {
    const getCountriesList = async () => {
      const countriesList = await getLocations();
      setCountries(countriesList);
      const countryObjToSet = countriesList?.filter((country) => {
        return country.country === user.country;
      });
      if (countryObjToSet) {
        setCountryObj(countryObjToSet[0]);
      }
    };

    getCountriesList();
  }, []);

  const updateFirstnameHandler = (e) => {
    setErrMsg({ code: null, msg: "" });
    setUpdatedUser((prevState) => {
      return {
        ...prevState,
        firstname: e.target.value,
      };
    });
    if (e.target.value.trim().length < 2) {
      setIsValid((prev) => {
        return { ...prev, firstname: false };
      });
    } else {
      setIsValid((prev) => {
        return { ...prev, firstname: true };
      });
    }
  };

  const updateLastnameHandler = (e) => {
    setErrMsg({ code: null, msg: "" });
    setUpdatedUser((prevState) => {
      return {
        ...prevState,
        lastname: e.target.value,
      };
    });
    if (e.target.value.trim().length < 2) {
      setIsValid((prev) => {
        return { ...prev, lastname: false };
      });
    } else {
      setIsValid((prev) => {
        return { ...prev, lastname: true };
      });
    }
  };

  const countryHandler = (e) => {
    setCountry(e.target.value);
    if (e.target.value === "") {
      setCity("");
      setUpdatedUser((prevState) => {
        return {
          ...prevState,
          country: e.target.value,
          city: "",
        };
      });
    }
    setUpdatedUser((prevState) => {
      return {
        ...prevState,
        country: e.target.value,
      };
    });
    setCountryObj(null);
  };

  const updateHandler = async (e) => {
    e.preventDefault();
    if (!isValid.firstname || !isValid.lastname) {
      setErrMsg({
        code: null,
        msg: "Invalid fields. Firstname and Lastname must be at least 2 characters.",
      });
      return;
    }
    setErrMsg({ code: null, msg: "" });
    setIsLoading(true);
    setErrMsg({ code: null, msg: "" });
    try {
      await req.put(`/user/${user.userId}`, {
        ...updatedUser,
        userId: user.userId,
      });
      dispatch(userActions.setUser({ ...updatedUser, userId: user.userId }));
      setIsLoading(false);
      setSuccessMsg(true);
      setTimeout(() => {
        setSuccessMsg(false);
      }, 2000);
    } catch (error) {
      setIsLoading(false);
      if (error.response.status === 500) {
        setErrMsg({
          code: 500,
          msg: "Something went wrong. Please try again.",
        });
      }
    }
  };

  const cancelHandler = () => {
    onCloseEdit(false);
  };

  return (
    <div className={classes["edit-wrapper"]}>
      <form className={classes["edit-form"]} onSubmit={updateHandler}>
        <div className={classes["profile-cover-wrapper"]}>
          <span className={classes["edit-text"]}>Cover picture:</span>
          <img
            className={classes["profile-cover"]}
            src={user.coverPicture || coverImg}
            alt="cover"
          />
        </div>
        <div className={classes["profile-picture"]}>
          <span className={classes["edit-text"]}>Profile picture:</span>
          <img
            className={classes["profile-pic"]}
            src={user.profilePicture || ppIcon}
            alt="cover"
          />
        </div>
        <div className={classes["edit-firstname-lastname"]}>
          <span className={classes["edit-text"]}>First name:</span>
          <input
            className={`${classes["edit-input"]} ${
              isValid.firstname === false && classes["edit-input-invalid"]
            }`}
            type="text"
            defaultValue={user.firstname}
            onChange={updateFirstnameHandler}
          />
        </div>
        <div className={classes["edit-firstname-lastname"]}>
          <span className={classes["edit-text"]}>Last name:</span>
          <input
            className={`${classes["edit-input"]} ${
              isValid.lastname === false && classes["edit-input-invalid"]
            }`}
            type="text"
            defaultValue={user.lastname}
            onChange={updateLastnameHandler}
          />
        </div>
        <div className={classes["edit-country-city-wrapper"]}>
          <span className={classes["edit-text"]}>Country:</span>
          <div className={classes["edit-country-city"]}>
            <input
              className={`${classes["edit-input-country-city"]}`}
              name="country"
              type="text"
              value={country}
              onChange={countryHandler}
              onFocus={() => {
                setCountryFocus(true);
              }}
              onBlur={() => setCountryFocus(false)}
              autoComplete="none"
              defaultValue={user.country}
            />
            {countryFocus && (
              <CountrySelector
                country={country}
                countries={countries}
                onSetCountryObj={setCountryObj}
                onSetCountry={setCountry}
                onSetUser={setUpdatedUser}
                // onEmptyCountries={setIsEmptyCountries}
              />
            )}
          </div>
        </div>
        <div className={classes["edit-country-city-wrapper"]}>
          <span className={classes["edit-text"]}>City</span>
          <div className={classes["edit-country-city"]}>
            <input
              className={`${classes["edit-input-country-city"]} ${
                country === "" && classes["disabled"]
              }`}
              name="city"
              type="text"
              value={city}
              onChange={(e) => {
                setCity(e.target.value);
                setUpdatedUser((prevState) => {
                  return {
                    ...prevState,
                    city: e.target.value,
                  };
                });
              }}
              onFocus={() => setCityFocus(true)}
              onBlur={() => setCityFocus(false)}
              autoComplete="none"
              defaultValue={user.city}
              disabled={country === "" ? true : false}
            />
            {cityFocus && countryObj && (
              /*city !== "" &&*/ <CitySelector
                city={city}
                country={countryObj}
                onSetCity={setCity}
                onSetUser={setUpdatedUser}
              />
            )}
          </div>
        </div>
        {(errMsg.msg !== "" || successMsg === true) && (
          <div className={classes["msg-wrapper"]}>
            {successMsg && (
              <span className={classes["success-msg"]}>
                Profile has been updated successfully.
              </span>
            )}
            {errMsg.msg !== "" && (
              <span className={classes["error-msg"]}>{errMsg.msg}</span>
            )}
          </div>
        )}
        <div className={classes["edit-buttons-wrapper"]}>
          <button className={classes["edit-save-btn"]}>
            {isLoading ? (
              <CircularProgress style={{ color: "white" }} size="20px" />
            ) : (
              "Save"
            )}
          </button>
          <button
            className={classes["edit-cancel-btn"]}
            onClick={cancelHandler}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfile;
