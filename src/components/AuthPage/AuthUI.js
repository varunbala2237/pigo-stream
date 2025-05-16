// AuthUI.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../firebase/firebase-auth';
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    updateProfile,
    sendEmailVerification,
    sendPasswordResetEmail,
    signInWithPopup,
    GoogleAuthProvider
} from 'firebase/auth';
import useCreateUser from '../../hooks/AuthPage/useCreateUser';
import Alert from '../../utils/Alert';

function AuthUI() {
    const navigate = useNavigate();
    const [userName, setUserName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isSignIn, setIsSignIn] = useState(true);
    const [showResendButton, setShowResendButton] = useState(false);
    const [resendCooldown, setResendCooldown] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    // Initialize the user collections
    useCreateUser();

    // This whole useEffect is only for already signed in cold starting users
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setIsLoading(false);
        }, 10000); // Set a timeout of 10 seconds

        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            clearTimeout(timeoutId); // Clear the timeout if confirmation is received
            setIsLoading(false);

            if (!user) return; // No user signed in

            // Reload user info
            await user.reload();
            if (user) {
                if (user.emailVerified) {
                    sessionStorage.setItem('welcomeMessage', "Welcome to PigoStream!");
                    setShowResendButton(false);
                    navigate('/index');
                } else {
                    setAlertMessage("Email not verified. Please check your inbox or click resend the email.");
                    setTimeout(() => setAlertMessage(''), 5000);

                    setShowResendButton(true);
                }
            }
        });

        return () => {
            clearTimeout(timeoutId); // Clean up the timeout
            unsubscribe(); // Clean up the observer
        };
    }, [navigate]);

    useEffect(() => {
        if (resendCooldown > 0) {
            const intervalId = setInterval(() => {
                setResendCooldown((prev) => {
                    if (prev <= 1) clearInterval(intervalId);
                    return prev - 1;
                });
            }, 1000);

            return () => clearInterval(intervalId);
        }
    }, [resendCooldown]);

    const signInWithCredentials = async (event) => {
        event.preventDefault();
        setIsSubmitting(true);

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const { user } = userCredential;


            if (user) {
                // Reload user info
                await user.reload();
                if (user.emailVerified) {
                    const isNewUser = user.metadata.creationTime === user.metadata.lastSignInTime;
                    const welcomeMessage = isNewUser ? "Welcome to PigoStream!" : "Welcome back to PigoStream!";

                    // Store the message in sessionStorage
                    sessionStorage.setItem('welcomeMessage', welcomeMessage);
                } else {
                    setAlertMessage("Email verification pending. Please click resend and check your inbox.");
                    setShowResendButton(true);
                    setTimeout(() => setAlertMessage(''), 5000);
                }
            }
        } catch (error) {
            setAlertMessage(error.message);
            setTimeout(() => setAlertMessage(''), 5000);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleForgotPassword = async () => {
        if (!email) {
            setAlertMessage('Please enter your email to reset your password.');
            setTimeout(() => setAlertMessage(''), 5000);
            return;
        }

        try {
            await sendPasswordResetEmail(auth, email);
            setAlertMessage('If this email is registered, a password reset email has been sent.');
        } catch (error) {
            setAlertMessage(error.message);
        } finally {
            setTimeout(() => setAlertMessage(''), 5000);
        }
    };

    const signUpWithCredentials = async (event) => {
        event.preventDefault();
        setIsSubmitting(true);

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            await updateProfile(user, { displayName: userName });

            // Sending verification email
            await sendEmailVerification(user);

            setAlertMessage("Verification email sent! Please check your inbox.");
            setShowResendButton(true);
            setTimeout(() => setAlertMessage(''), 5000);
        } catch (error) {
            setAlertMessage(error.message);
            setTimeout(() => setAlertMessage(''), 5000);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Only works when user is trying to sign in or sign up
    const resendVerificationEmail = async () => {
        const user = auth.currentUser;
        if (user && !user.emailVerified && resendCooldown === 0) {
            try {
                // Reload user state and send verification email
                await user.reload();
                await sendEmailVerification(user);

                setAlertMessage('Verification email resent! Check your inbox.');
                setResendCooldown(30); // 30 second cooldown
            } catch (error) {
                setAlertMessage('Failed to resend verification email. Please try again.');
                setResendCooldown(30); // 30 second cooldown
            } finally {
                setTimeout(() => setAlertMessage(''), 5000);
            }
        }
    };

    // Create Google sign-in provider
    const googleProvider = new GoogleAuthProvider();
    const signInWithGoogle = async (event) => {
        event.preventDefault();
        try {
            const userCredential = await signInWithPopup(auth, googleProvider);
            const { user } = userCredential;

            if (user) {
                const isNewUser = user.metadata.creationTime === user.metadata.lastSignInTime;
                const welcomeMessage = isNewUser ? "Welcome to PigoStream!" : "Welcome back to PigoStream!";

                // Store the welcome message in sessionStorage
                sessionStorage.setItem('welcomeMessage', welcomeMessage);
            }
        } catch (error) {
            setAlertMessage(error.message);
            setTimeout(() => setAlertMessage(''), 5000);
        }
    };

    const toggleAuthMode = () => {
        setAlertMessage('');
        setShowResendButton(false);
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
                                            id="userName"
                                            type="text"
                                            className="form-control custom-bg rounded-pill custom-textarea text-white dynamic-fs"
                                            value={userName}
                                            onChange={(e) => setUserName(e.target.value)}
                                            placeholder="Enter username"
                                            required={!isSignIn}
                                        />
                                    </div>
                                )}
                                <div className="mb-3 dynamic-ts">
                                    <label htmlFor="userEmail" className="form-label">E-mail address</label>
                                    <input
                                        id="userEmail"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="form-control custom-bg rounded-pill custom-textarea text-white dynamic-fs"
                                        placeholder="Enter e-mail address"
                                        required
                                    />
                                </div>
                                <div className="mb-2 dynamic-ts">
                                    <label htmlFor="password" className="form-label">Password</label>
                                    <div className="input-group custom-input-group mb-2">
                                        <input
                                            id="passwordInput"
                                            type={showPassword ? 'text' : 'password'}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="form-control custom-bg text-white custom-textarea rounded-pill-l border-0 dynamic-fs"
                                            placeholder="Enter password"
                                            required
                                        />
                                        <button
                                            className="btn btn-dark custom-bg m-0 border-0 rounded-pill-r"
                                            type="button"
                                            onClick={() => setShowPassword((prev) => !prev)}
                                        >
                                            <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                                        </button>
                                    </div>
                                    {isSignIn && (
                                        <div className="d-flex justify-content-end">
                                            <button
                                                type="button"
                                                className="btn btn-transparent text-danger border-0 rounded-pill dynamic-fs"
                                                onClick={handleForgotPassword}
                                            >
                                                Forgot Password
                                            </button>
                                        </div>
                                    )}
                                </div>
                                <div className="d-grid dynamic-fs">
                                    <button type="submit" className="btn btn-success custom-theme-btn rounded-pill dynamic-fs mb-2" disabled={isSubmitting}>
                                        {isSubmitting ? 'Loading...' : isSignIn ? 'Sign in' : 'Sign up'}
                                    </button>
                                    {showResendButton && (
                                        <div className="d-flex justify-content-end mb-2">
                                            <button
                                                type="button"
                                                className="btn btn-transparent text-primary border-0 rounded-pill dynamic-fs"
                                                onClick={resendVerificationEmail}
                                                disabled={resendCooldown > 0}
                                            >
                                                {resendCooldown > 0 ? `Try again in (${resendCooldown}s)` : 'Resend'}
                                            </button>
                                        </div>
                                    )}
                                    <p className="text-white mb-2 text-center">or</p>
                                    <button className="btn btn-primary rounded-pill dynamic-fs mb-2" onClick={signInWithGoogle}>
                                        <i className="bi bi-google me-2"></i>Sign in with Google
                                    </button>
                                </div>
                            </form>
                            <div className="text-center text-white dynamic-fs">
                                {isSignIn ? (
                                    <p>
                                        Don't have an account?
                                        <button type="button" className="btn btn-transparent text-primary border-0 dynamic-fs" onClick={toggleAuthMode}>
                                            Sign up
                                        </button>
                                    </p>
                                ) : (
                                    <p>
                                        Already have an account?
                                        <button type="button" className="btn btn-transparent text-primary border-0 dynamic-fs" onClick={toggleAuthMode}>
                                            Sign in
                                        </button>
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* Alert messages*/}
            {alertMessage && <Alert message={alertMessage} onClose={handleAlertDismiss} />}
        </div>
    );
}

export default AuthUI;