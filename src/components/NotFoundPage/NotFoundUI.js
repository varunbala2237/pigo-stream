// NotFoundUI.js
export default function NotFoundUI() {
  return (
    <div className="container-fluid d-flex flex-column justify-content-center align-items-center vh-100 p-0">
      <div className="w-100 text-center text-white">
        <h1 className="display-4 dynamic-hs">404 - Page Not Found</h1>
        <p className="lead dynamic-fs">The page you're looking for doesn't exist.</p>
      </div>
    </div>
  );
}