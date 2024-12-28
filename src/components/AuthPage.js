import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, signInWithGoogle } from '../firebase/firebase-auth';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import useCreateUser from '../hooks/useCreateUser';
import Alert from '../Alert';
import Footer from './Footer';

function togglePasswordVisibility() {
    const passwordInput = document.getElementById('passwordInput');
    const eyeIcon = document.getElementById('eyeIcon');

    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        eyeIcon.classList.remove('bi-eye');
        eyeIcon.classList.add('bi-eye-slash');
    } else {
        passwordInput.type = 'password';
        eyeIcon.classList.remove('bi-eye-slash');
        eyeIcon.classList.add('bi-eye');
    }
}

function AuthPage() {
    const navigate = useNavigate();
    const [isSignIn, setIsSignIn] = useState(true);
    const [alertMessage, setAlertMessage] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    // Initialize the user collections
    useCreateUser();

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setIsLoading(false);
        }, 10000); // Set a timeout of 10 seconds

        const unsubscribe = auth.onAuthStateChanged((user) => {
            clearTimeout(timeoutId); // Clear the timeout if confirmation is received
            setIsLoading(false);
            if (user) {
                navigate('/index');
            }
        });

        return () => {
            clearTimeout(timeoutId); // Clean up the timeout
            unsubscribe(); // Clean up the observer
        };
    }, [navigate]);

    const navigateToIndex = () => {
        navigate('/index');
    };

    const signInWithCredentials = async (event) => {
        event.preventDefault();
        const email = document.getElementById('userEmail').value;
        const password = document.getElementById('passwordInput').value;

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const { user } = userCredential;
    
            const isNewUser = user.metadata.creationTime === user.metadata.lastSignInTime;
            const welcomeMessage = isNewUser ? "Welcome to PigoStream!" : "Welcome back to PigoStream!";
    
            // Store the message in sessionStorage
            sessionStorage.setItem('welcomeMessage', welcomeMessage);
            
            navigateToIndex();
        } catch (error) {
            console.error(error.message);
            setAlertMessage(error.message);
            setTimeout(() => setAlertMessage(''), 5000);
        }
    };

    const signUpWithCredentials = async (event) => {
        event.preventDefault();
        const displayName = document.getElementById('userName').value;
        const email = document.getElementById('userEmail').value;
        const password = document.getElementById('passwordInput').value;

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            await updateProfile(user, { displayName });

            // Store the message in sessionStorage
            sessionStorage.setItem('welcomeMessage', "Welcome to PigoStream!");

            navigateToIndex();
        } catch (error) {
            console.error(error.message);
            setAlertMessage(error.message);
            setTimeout(() => setAlertMessage(''), 5000);
        }
    };

    const toggleAuthMode = () => {
        setIsSignIn((prev) => !prev);
    };

    const handleAlertDismiss = () => {
        setAlertMessage('');
    };

    return (
        <div className="d-flex flex-column vh-100 w-100 poppins-medium">
            {isLoading ? (
                <div className="d-flex justify-content-center align-items-center vh-100">
                    <div className="spinner-border theme-color spinner-size-3" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            ) : (
                <>
                <div className="container vh-100 d-flex bg-transparent border-0 justify-content-center align-items-center">
                  <div className="card bg-transparent border-0 p-4 w-100 form-pad">
                    <div className="card-header d-flex justify-content-center align-items-center text-white">
                      <img className="mb-2" src="favicon.ico" alt="PigoStream" width="40" height="40" /> 
                      <h3 className="text-center dynamic-hs">{isSignIn ? 'Sign in' : 'Sign up'}</h3>
                    </div>
                    <form onSubmit={isSignIn ? signInWithCredentials : signUpWithCredentials} className="text-white">
                        {!isSignIn && (
                            <div className="mb-3 dynamic-ts">
                                <label htmlFor="userName" className="form-label">Username</label>
                                <input
                                    type="text"
                                    className="form-control custom-bg custom-border custom-textarea text-white dynamic-fs"
                                    id="userName"
                                    placeholder="Enter username"
                                    required={!isSignIn}
                                />
                            </div>
                        )}
                        <div className="mb-3 dynamic-ts">
                            <label htmlFor="userEmail" className="form-label">E-mail address</label>
                            <input
                                type="text"
                                className="form-control custom-bg custom-border custom-textarea text-white dynamic-fs"
                                id="userEmail"
                                placeholder="Enter e-mail address"
                                required
                            />
                        </div>
                        <div className="mb-3 dynamic-ts">
                            <label htmlFor="password" className="form-label">Password</label>
                            <div className="input-group custom-input-group custom-border">
                                <input
                                    id="passwordInput"
                                    type="password"
                                    className="form-control custom-bg text-white custom-textarea custom-border-l border-0 dynamic-fs"
                                    placeholder="Enter password"
                                    required
                                />
                                <button
                                    className="btn btn-dark custom-bg m-0 border-0 custom-border-r"
                                    type="button"
                                    onClick={togglePasswordVisibility}
                                >
                                    <i id="eyeIcon" className="bi bi-eye"></i>
                                </button>
                            </div>
                        </div>
                        <div className="d-grid gap-2 dynamic-fs">
                            <button type="submit" className="btn btn-success custom-theme-btn custom-theme-radius">
                                {isSignIn ? 'Sign in' : 'Sign up'}
                            </button>
                            <p className="text-white mb-2 text-center">or</p>
                            <button className="btn btn-primary custom-theme-radius" onClick={signInWithGoogle}>
                                Sign in with <i className="bi bi-google"></i>oogle
                            </button>
                        </div>
                    </form>
                    <div className="mt-3 text-center text-white dynamic-fs">
                        {isSignIn ? (
                            <p>
                                Don't have an account?
                                <button className="btn btn-transparent text-primary border-0 dynamic-fs" onClick={toggleAuthMode}>
                                    Sign up
                                </button>
                            </p>
                        ) : (
                            <p>
                                Already have an account?
                                <button className="btn btn-transparent text-primary border-0 dynamic-fs" onClick={toggleAuthMode}>
                                    Sign in
                                </button>
                            </p>
                        )}
                    </div>
                  </div>
                </div>
                <Footer/>
                </>
            )}
            {alertMessage && <Alert message={alertMessage} onClose={handleAlertDismiss} />}
        </div>
    );
}

export default AuthPage;