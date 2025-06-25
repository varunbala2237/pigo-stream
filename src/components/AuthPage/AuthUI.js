// AuthUI.js
import { useEffect, useState } from 'react';
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
import OverlaySpinner from '../../utils/OverlaySpinner';
import Alert from '../../utils/Alert';

import { getSessionValue, setSessionValue } from '../../utils/sessionStorageStates';

function AuthUI() {
    const navigate = useNavigate();
    const [userName, setUserName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isSignIn, setIsSignIn] = useState(true);
    const [showResendButton, setShowResendButton] = useState(false);
    const [resendCooldown, setResendCooldown] = useState(0);
    const [isCredentialProcessing, setIsCredentialProcessing] = useState(false);
    const [isGoogleProcessing, setIsGoogleProcessing] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [isPageLoading, setIsPageLoading] = useState(true);

    // Initialize the user collections
    useCreateUser();

    // This whole useEffect is only for already signed in cold starting users
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setIsPageLoading(false);
        }, 10000); // Set a timeout of 10 seconds

        const triggerIndexPage = () => {
            setShowResendButton(false);
            navigate('/index'); // Navigate to index
        };

        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            clearTimeout(timeoutId); // Clear fallback

            if (!user) {
                setIsPageLoading(false);
                return; // !important
            }

            // Safe reload with fallback on failure
            await user.reload().catch(() => {
                setIsPageLoading(false);
                return;
            });

            if (user?.emailVerified) {
                triggerIndexPage();
            } else {
                setIsPageLoading(false);
            }
        });

        const checkEmailVerification = async () => {
            const user = auth.currentUser;

            if (!user) return; // !important

            // Reload user info
            await user.reload();

            if (user?.emailVerified) {
                triggerIndexPage();
            }
        };

        window.addEventListener('focus', checkEmailVerification);

        return () => {
            clearTimeout(timeoutId); // Clear fallback
            unsubscribe(); // Safe to call
            window.removeEventListener('focus', checkEmailVerification);
        };
    }, [navigate]);

    useEffect(() => {
        // Restore session values
        const savedUserName = getSessionValue('AuthUI', 'userName') || '';
        const savedEmail = getSessionValue('AuthUI', 'email') || '';
        const savedIsSignInState = getSessionValue('AuthUI', 'isSignInState') ?? true;
        const savedScrollY = getSessionValue('AuthUI', 'pageScrollState') || 0;

        if (savedUserName) setUserName(savedUserName);
        if (savedEmail) setEmail(savedEmail);
        setIsSignIn(savedIsSignInState);
        if (savedScrollY) {
            requestAnimationFrame(() => {
                window.scrollTo({ top: savedScrollY, behavior: 'instant' });
            });
        }

        const handlePageScroll = () => {
            setSessionValue('AuthUI', 'pageScrollState', window.scrollY);
        };

        window.addEventListener('scroll', handlePageScroll);
        return () => window.removeEventListener('scroll', handlePageScroll);
    }, []);

    // Save session values
    useEffect(() => {
        setSessionValue('AuthUI', 'userName', userName);
    }, [userName]);

    useEffect(() => {
        setSessionValue('AuthUI', 'email', email);
    }, [email]);

    // Resend button cooldown
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
        setIsCredentialProcessing(true);

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const { user } = userCredential;


            if (user) {
                // Reload user info
                await user.reload();

                if (!user.emailVerified) {
                    setAlertMessage("Email verification pending. Please click resend and check your inbox.");
                    setShowResendButton(true);
                    setTimeout(() => setAlertMessage(''), 5000);
                }
            }
        } catch (error) {
            setAlertMessage(error.message);
            setTimeout(() => setAlertMessage(''), 5000);
        } finally {
            setIsCredentialProcessing(false);
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
        setIsCredentialProcessing(true);

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            await updateProfile(user, { displayName: userName });

            // Sending verification email
            await sendEmailVerification(user);

            // Welcome message for new user
            const isNewUser = user.metadata.creationTime === user.metadata.lastSignInTime;
            if (isNewUser) {
                setSessionValue('HomeUI', 'welcomeMessage', 'Welcome to PigoStream!');
            }

            setAlertMessage("Verification email sent! Please check your inbox.");
            setShowResendButton(true);
            setTimeout(() => setAlertMessage(''), 5000);
        } catch (error) {
            setAlertMessage(error.message);
            setTimeout(() => setAlertMessage(''), 5000);
        } finally {
            setIsCredentialProcessing(false);
        }
    };

    // Only works when user is trying to sign in or sign up
    const resendVerificationEmail = async () => {
        const user = auth.currentUser;
        if (user && !user.emailVerified && resendCooldown === 0) {
            try {
                // Reload user state and send verification email
                await user.reload();

                // Sending verification email
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
        setIsGoogleProcessing(true);
        try {
            const userCredential = await signInWithPopup(auth, googleProvider);
            const { user } = userCredential;

            if (user) {
                const isNewUser = user.metadata.creationTime === user.metadata.lastSignInTime;

                if (isNewUser) {
                    setSessionValue('HomeUI', 'welcomeMessage', 'Welcome to PigoStream!');
                }
            }
        } catch (error) {
            setAlertMessage(error.message);
            setTimeout(() => setAlertMessage(''), 5000);
        } finally {
            setIsGoogleProcessing(false);
        }
    };

    const toggleAuthMode = () => {
        setAlertMessage('');
        setShowResendButton(false);
        setIsSignIn((prev) => {
            const next = !prev;
            setSessionValue('AuthUI', 'isSignInState', next);
            return next;
        });
    };

    const handleAlertDismiss = () => {
        setAlertMessage('');
    };

    return (
        <div className="d-flex flex-column vh-100 w-100">
            <div className="container vh-100 d-flex bg-transparent justify-content-center align-items-center">
                {/* Overlay spinner for loading state */}
                <OverlaySpinner visible={isPageLoading} />

                <div className="card custom-bg custom-theme-radius-low p-2">
                    <div className="card-header d-flex justify-content-center align-items-center text-white">
                        <img src="favicon.ico" alt="PigoStream" width="48" height="48" />
                        <span className="dynamic-hs"><b>Pigo</b>Stream</span>
                    </div>
                    <form onSubmit={isSignIn ? signInWithCredentials : signUpWithCredentials} className="text-white">
                        {!isSignIn && (
                            <div className="d-flex flex-column dynamic-ts m-2">
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
                        <div className="d-flex flex-column dynamic-ts m-2">
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
                        <div className="d-flex flex-column dynamic-ts m-2">
                            <label htmlFor="password" className="form-label">Password</label>
                            <div className="input-group custom-input-group">
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
                                        className="btn btn-transparent text-primary border-0 dynamic-fs"
                                        onClick={handleForgotPassword}
                                    >
                                        Forgot Password
                                    </button>
                                </div>
                            )}
                        </div>
                        <div className="d-flex flex-column dynamic-fs m-2">
                            <button
                                type="submit"
                                className="btn btn-success custom-theme-btn d-flex justify-content-center rounded-pill dynamic-fs"
                                disabled={isCredentialProcessing}>
                                {isSignIn ? 'Sign in' : 'Sign up'}
                            </button>
                            {showResendButton && (
                                <div className="d-flex justify-content-end">
                                    <button
                                        type="button"
                                        className="btn btn-transparent text-primary border-0 dynamic-fs"
                                        onClick={resendVerificationEmail}
                                        disabled={resendCooldown > 0}
                                    >
                                        {resendCooldown > 0 ? `Try again in (${resendCooldown}s)` : 'Resend'}
                                    </button>
                                </div>
                            )}
                            <p className="text-white text-center m-0">or</p>
                            <button
                                className="btn btn-primary d-flex justify-content-center rounded-pill dynamic-fs"
                                onClick={signInWithGoogle}
                                disabled={isGoogleProcessing}
                            >
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

            {/* No Need for Connection Modal */}

            {/* Alert message handling */}
            {alertMessage && <Alert message={alertMessage} onClose={handleAlertDismiss} />}
        </div>
    );
}

export default AuthUI;