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
        <div className="container-fluid vh-100 d-flex justify-content-center align-items-center poppins-medium">
            {isLoading ? (
                <div className="spinner-border theme-color spinner-size-3" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            ) : (
                <div className="card text-white bg-transparent border-0 p-4 custom-theme-radius">
                    <div className="card-header d-flex justify-content-center align-items-center">
                      <img className="mb-2" src="favicon.ico" alt="PigoStream" width="40" height="40" /> 
                      <h2 className="text-center">{isSignIn ? 'Sign in' : 'Sign up'}</h2>
                    </div>
                    <form onSubmit={isSignIn ? signInWithCredentials : signUpWithCredentials}>
                        {!isSignIn && (
                            <div className="mb-3">
                                <label htmlFor="userName" className="form-label">Username</label>
                                <input
                                    type="text"
                                    className="form-control custom-bg-primary custom-border custom-textarea text-white"
                                    id="userName"
                                    placeholder="Enter username"
                                    required={!isSignIn}
                                />
                            </div>
                        )}
                        <div className="mb-3">
                            <label htmlFor="userEmail" className="form-label">E-mail address</label>
                            <input
                                type="text"
                                className="form-control custom-bg-primary custom-border custom-textarea text-white"
                                id="userEmail"
                                placeholder="Enter e-mail address"
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="password" className="form-label">Password</label>
                            <div className="input-group custom-input-group custom-border">
                                <input
                                    id="passwordInput"
                                    type="password"
                                    className="form-control custom-bg-primary text-white custom-textarea custom-border-l border-0"
                                    placeholder="Enter password"
                                    required
                                />
                                <button
                                    className="btn btn-dark custom-bg-primary m-0 border-0 custom-border-r"
                                    type="button"
                                    onClick={togglePasswordVisibility}
                                >
                                    <i id="eyeIcon" className="bi bi-eye"></i>
                                </button>
                            </div>
                        </div>
                        <div className="d-grid gap-2">
                            <button type="submit" className="btn btn-success custom-theme-btn rounded-pill">
                                {isSignIn ? 'Sign in' : 'Sign up'}
                            </button>
                            <p className="text-white mb-2 text-center">or</p>
                            <button className="btn btn-primary rounded-pill" onClick={signInWithGoogle}>
                                Sign in with <i className="bi bi-google"></i>oogle
                            </button>
                        </div>
                    </form>
                    <div className="mt-3 text-center">
                        {isSignIn ? (
                            <p>
                                Don't have an account?
                                <button className="btn btn-transparent text-primary border-0" onClick={toggleAuthMode}>
                                    Sign up
                                </button>
                            </p>
                        ) : (
                            <p>
                                Already have an account?
                                <button className="btn btn-transparent text-primary border-0" onClick={toggleAuthMode}>
                                    Sign in
                                </button>
                            </p>
                        )}
                    </div>
                    <Footer/>
                </div>
            )}
            {alertMessage && <Alert message={alertMessage} onClose={handleAlertDismiss} />}
        </div>
    );
}

export default AuthPage;