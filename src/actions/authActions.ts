import { AppThunk } from "../store";
import {
  loginRequest,
  loginSuccess,
  loginFailure,
  logout,
} from "../reducers/authReducer";
import { User, UserCredentials } from "../types";
import { loginUser, registerUser } from "../api/user";

export const login =
  (credentials: UserCredentials): AppThunk =>
  async (dispatch) => {
    try {
      dispatch(loginRequest());

      const { access, user } = await loginUser(credentials);
      console.log("user", user);

      localStorage.setItem("token", access);
      dispatch(loginSuccess({ token: access, user }));
    } catch (error: any) {
      dispatch(
        loginFailure(
          error.response ? error.response.data.message : "Login failed"
        )
      );
    }
  };

export const register =
  (data: User): AppThunk =>
  async (dispatch) => {
    try {
      dispatch(loginRequest());
      const { access, user } = await registerUser(data);
      localStorage.setItem("token", access);
      dispatch(loginSuccess({ token: access, user }));
    } catch (error: any) {
      dispatch(
        loginFailure(
          error.response ? error.response.data.message : "Registration failed"
        )
      );
    }
  };

export const logoutUser = (): AppThunk => async (dispatch) => {
  try {
    localStorage.removeItem("token");
    dispatch(logout());
  } catch (error: any) {
    dispatch(
      loginFailure(
        error.response ? error.response.data.message : "Logout failed"
      )
    );
  }
};

