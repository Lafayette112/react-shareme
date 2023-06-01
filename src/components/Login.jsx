import React from 'react';
import { useNavigate } from 'react-router-dom';
import shareVideo from '../assets/share.mp4';
import logo from '../assets/logowhite.png'
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import { client } from '../client';
import jwt_decode from 'jwt-decode';

const Login = () => {

  const navigate = useNavigate();

  // use jwt_decode()
  const createOrGetuser = async (response) => {
    console.log(response);
    const decoded = jwt_decode(response.credential);

    localStorage.setItem('user', JSON.stringify(decoded));

    const { name, email, picture, sub } = decoded;
    console.log({ name, email, picture, sub });

    // save user as a Sanity 'user' document
    const doc = {
      _id: sub,
      _type: 'user',
      userName: name,
      image: picture,
    };

    client.createIfNotExists(doc).then(() => {
      navigate('/', { replace: true });
    });
  };

  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_API_TOKEN}>
      <div className='flex justify-start items-center flex-col h-screen'>
        <div className='relative w-full h-full'>

          {/* video */}
          <video 
            src={shareVideo} 
            type="video/mp4"
            loop
            controls={false}
            muted
            autoPlay
            className='w-full h-full object-cover'
          />

          {/* black overlay */}
          <div className='absolute flex flex-col justify-center items-center top-0 right-0 left-0 bottom-0 bg-blackOverlay'>

            {/* logo */}
            <div className='p-5'>
              <img src={logo} width="130px" alt="logo" />
            </div>

            {/* google login */}
            <div className='shadow-2xl'>

              <GoogleLogin 
                shape='circle'
                onSuccess={(response) => createOrGetuser(response)}
                
                onError={() => console.log('Error')}
              />

            </div>
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  )
}

export default Login