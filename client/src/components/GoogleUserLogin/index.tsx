import React from 'react'
import { GoogleLogin } from 'react-google-login'
import axios from 'axios'

const GoogleUserLogin = () => {
  const GOOGLE_CLIENT = process.env.REACT_APP_GOOGLE_API_KEY as string

  const responseSuccessGoogle = async (response: any) => {
    const userToken = await response.tokenObj.id_token
    axios
      .post('http://localhost:5000/api/v1/users/google-authenticate', userToken)
      .then((response: any) => {
        console.log(response)
      })
  }

  const responseFailGoogle = (response: any) => {
    console.log(response)
  }

  return (
    <GoogleLogin
      clientId={GOOGLE_CLIENT}
      buttonText="Login with Google"
      onSuccess={responseSuccessGoogle}
      onFailure={responseFailGoogle}
      cookiePolicy={'single_host_origin'}
    />
  )
}

export default GoogleUserLogin
