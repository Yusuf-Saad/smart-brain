import React from 'react';
import './Navigation.css';

const Navigation = ( {onRouteChange, isSignedIn} ) => {
        if (isSignedIn) {
            return (
            <div className='container'>
                <nav style={{display: 'flex', justifyContent: 'flex-end'}}>
                    <p onClick={() => onRouteChange('signout')} className='f3 link pa3 pointer underline2 p'>Sign Out
                    </p>
                </nav>   
             </div>
          );
        } else {
            return (
            <div className='contianer'>
                <nav style={{display: 'flex', justifyContent: 'flex-end'}}>
                    <p onClick={() => onRouteChange('signin')}className=' f3 link pa3 pointer underline2 p'>Sign In</p>
                    <p onClick={() => onRouteChange('register')}className='f3 link pa3 pointer underline2 p'>Register</p>
                </nav>
            </div>
            );
        }
}

export default Navigation;