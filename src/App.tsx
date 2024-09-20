import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import LoginPage from './screen/LoginPage';
import CalendarPage from './screen/CalendarPage';
import { RootState, AppDispatch } from './store';
import {jwtDecode} from 'jwt-decode';
import { logoutUser } from './actions/authActions';
import { loginSuccess } from './reducers/authReducer';

function App() {
  const dispatch = useDispatch<AppDispatch>();
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
  const token = useSelector((state: RootState) => state.auth.token);
  console.log('dadadatoken',token)

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded: any = jwtDecode(token);
      const now = Date.now() / 1000;

      console.log('decoded.exp',decoded.exp,now > decoded.exp)

      if (now > decoded.exp) {
        dispatch(logoutUser());
      }else{
        dispatch(loginSuccess({ token, user:decoded }));
      }
    }
  }, [dispatch]);

  return (
    <div className="App">
      {isLoggedIn ? <CalendarPage /> : <LoginPage />}
    </div>
  );
}

export default App;
