import { Suspense, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Loading from './Loading';

const MINIMUM_LOADING_MS = 1500;

const PageLoading = ({ children }) => {
  const [minimumPending, setMinimumPending] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setMinimumPending(false), MINIMUM_LOADING_MS);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {minimumPending && <Loading />}
      <div inert={minimumPending} style={{ display: 'contents' }}>
        <Suspense fallback={minimumPending ? null : <Loading />}>
          {children}
        </Suspense>
      </div>
    </>
  );
};

const RouteLoading = ({ children }) => {
  const location = useLocation();

  // Restart the timer on every navigation, including cached pages and Back/Forward.
  return <PageLoading key={location.key} >{children}</PageLoading>;
};

export default RouteLoading;
