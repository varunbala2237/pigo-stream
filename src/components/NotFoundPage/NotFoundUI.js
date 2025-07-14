// NotFoundUI.js

const NotFoundUI = () => {
  return (
    <div className="container-fluid d-flex flex-column justify-content-center align-items-center vh-100 p-0">
      <div className="w-100 text-center text-white">
        <span className="dynamic-hs fw-bold">404 - Page Not Found</span>
        <span className="dynamic-fs">The page you're looking for doesn't exist.</span>
      </div>
    </div>
  );
}

export default NotFoundUI;