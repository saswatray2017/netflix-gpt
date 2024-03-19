import React, { useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";

import Header from "./Header";
import { auth } from "../utils/firebase";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { LOGIN_BG, USER_AVATAR } from "../utils/constants";

const DEFAULT_FORM_OBJ = {
  email: "",
  password: "",
};
const DEFAULT_FORM_ERROR_OBJ = {
  email: false,
  password: false,
};
const DEFAULT_FORM_TOUCHED_OBJ = {
  email: false,
  password: false,
};

const DEFAULT_FORM_VALIDATION_Fn = {
  fullName: (name) => {
    return name.trim() === "";
  },
  email: (email) =>
    !String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      ),
  password: (password) => {
    return !/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/.test(
      password
    );
  },
};
const Login = () => {
  const [isSignInForm, setIsSignInForm] = useState(true);
  const [formObj, setformObj] = useState(DEFAULT_FORM_OBJ);
  const [errorObj, setErrorObj] = useState(DEFAULT_FORM_ERROR_OBJ);
  const [didEdit, setDidEdit] = useState(DEFAULT_FORM_TOUCHED_OBJ);
  const [errorMessage, setErrorMessage] = useState();
  const dispatch = useDispatch();
  const toggleSignForm = () => {
    setIsSignInForm((prevState) => {
      if (prevState) {
        setformObj({
          fullName: "",
          ...DEFAULT_FORM_OBJ,
        });
        setErrorObj({
          fullName: false,
          ...DEFAULT_FORM_ERROR_OBJ,
        });
        setDidEdit({
          fullName: false,
          ...DEFAULT_FORM_TOUCHED_OBJ,
        });
      } else {
        setformObj(DEFAULT_FORM_OBJ);
        setErrorObj(DEFAULT_FORM_ERROR_OBJ);
        setDidEdit(DEFAULT_FORM_TOUCHED_OBJ);
      }
      return !prevState;
    });
  };
  const onChangeHandler = (event) => {
    setformObj((prevForm) => {
      return {
        ...prevForm,
        [event.target.name]: event.target.value,
      };
    });
    setDidEdit((prevForm) => {
      return {
        ...prevForm,
        [event.target.name]: false,
      };
    });
  };
  const onBlurHandler = (event) => {
    setDidEdit((prevForm) => {
      return {
        ...prevForm,
        [event.target.name]: true,
      };
    });
    setErrorObj((prevForm) => {
      return {
        ...prevForm,
        [event.target.name]: DEFAULT_FORM_VALIDATION_Fn[event.target.name](
          event.target.value
        ),
      };
    });
  };
  const fromSubmitHandler = (event) => {
    event.preventDefault();
    if (!validateForm()) return;
    if (!isSignInForm) {
      createUserWithEmailAndPassword(auth, formObj.email, formObj.password)
        .then((userCredential) => {
          // Signed up
          setformObj({
            fullName: "",
            ...DEFAULT_FORM_OBJ,
          });
          setErrorObj({
            fullName: false,
            ...DEFAULT_FORM_ERROR_OBJ,
          });
          setDidEdit({
            fullName: false,
            ...DEFAULT_FORM_TOUCHED_OBJ,
          });
          const user = userCredential.user;
          updateProfile(user, {
            displayName: formObj.fullName,
            photoURL: USER_AVATAR,
          })
            .then(() => {
              const { uid, email, displayName, photoURL } = auth.currentUser;
              dispatch(
                addUser({
                  uid: uid,
                  email: email,
                  displayName: displayName,
                  photoURL: photoURL
                })
              );
            })
            .catch((error) => {
              setErrorMessage(error.message);
            });
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          setErrorMessage(errorCode + "-" + errorMessage);
          // ..
        });
    } else {
      signInWithEmailAndPassword(auth, formObj.email, formObj.password)
        .then((userCredential) => {
          // Signed in
          setformObj(DEFAULT_FORM_OBJ);
          setErrorObj(DEFAULT_FORM_ERROR_OBJ);
          setDidEdit(DEFAULT_FORM_TOUCHED_OBJ);
          setErrorMessage("");
          // ...
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          setErrorMessage(errorCode + "-" + errorMessage);
        });
    }
  };
  const validateForm = () => {
    return (
      didEdit.email &&
      !errorObj.email &&
      didEdit.password &&
      !errorObj.password &&
      (isSignInForm || (didEdit.fullName && !errorObj.fullName))
    );
  };
  return (
    <div>
      <Header />
      <div className="absolute">
        <img
          src= {LOGIN_BG}
          alt="logo"
        />
      </div>
      <form
        className="absolute p-12 bg-black w-3/12 my-36 mx-auto left-0 right-0 text-white rounded-lg bg-opacity-80"
        onSubmit={fromSubmitHandler}
      >
        <h1 className="font-bold text-xl py-4">
          {isSignInForm ? "Sign In" : "Sign Up"}
        </h1>
        {!isSignInForm && (
          <input
            type="text"
            placeholder="Full Name"
            name="fullName"
            value={formObj.fullName}
            onChange={onChangeHandler}
            onBlur={onBlurHandler}
            className="p-2 my-2 w-full bg-gray-700"
          ></input>
        )}
        {!isSignInForm && didEdit.fullName && errorObj.fullName && (
          <p className="text-sm text-red-700">Full Name cannot be empty</p>
        )}
        <input
          type="text"
          placeholder="Email Address"
          name="email"
          value={formObj.email}
          onChange={onChangeHandler}
          onBlur={onBlurHandler}
          className="p-2 my-2 w-full bg-gray-700"
        ></input>
        {didEdit.email && errorObj.email && (
          <p className="text-sm text-red-700">Invalid Email Address</p>
        )}
        <input
          type="password"
          placeholder="Password"
          name="password"
          value={formObj.password}
          onChange={onChangeHandler}
          onBlur={onBlurHandler}
          className="p-2 my-2 w-full bg-gray-700"
        ></input>
        {didEdit.password && errorObj.password && (
          <p className="text-sm text-red-700">Invalid Password</p>
        )}
        <p className="text-red-500 font-bold text-lg py-2">{errorMessage}</p>
        <button className="p-4 my-4 bg-red-700 w-full">
          {isSignInForm ? "Sign In" : "Sign Up"}
        </button>
        <p className="py-4 cursor-pointer" onClick={toggleSignForm}>
          {isSignInForm
            ? "New to Netflix? Sign up Now"
            : "Already Registered? Sign in now"}
        </p>
      </form>
    </div>
  );
};

export default Login;
