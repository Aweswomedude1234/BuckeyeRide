import React, { useEffect } from 'react';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { GOOGLE_CLIENT_ID } from '../config';

GoogleSignin.configure({
  webClientId: GOOGLE_CLIENT_ID, // client ID of type WEB for your app
});

const GoogleSignIn = () => {
  useEffect(() => {
    const initGoogleSignIn = async () => {
      try {
        await GoogleSignin.hasPlayServices();
        const userInfo = await GoogleSignin.signIn();
        console.log(userInfo);
      } catch (error) {
        console.error(error);
      }
    };

    initGoogleSignIn();
  }, []);

  return null;
};

export default GoogleSignIn;