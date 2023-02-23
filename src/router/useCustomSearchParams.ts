import { useLocation, useParams, useSearchParams } from 'react-router-dom';

import { getUrlQueryParams } from '../helpers/functional/url';

export function useCustomSearchParams() {
  const loc = useLocation();
  return {
    pathname: loc.pathname,
    query: getUrlQueryParams(),
  };
}
