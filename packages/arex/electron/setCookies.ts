import { session } from 'electron'
function parseCookies(cookieString) {
  const cookies = cookieString.split(';');
  return cookies.map(cookie => {
    const [name, value] = cookie.split('=');
    return { name, value };
  });
}

function getOrigin(urlString) {
  const url = new URL(urlString);
  return url.origin;
}

export function setCookie(endpoint: string, cookieString) {
  const cookies = parseCookies(cookieString);
  const allCookies = []
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i];
    const setCookie = { url: getOrigin(endpoint), name: cookie.name, value: cookie.value };
    allCookies.push(session.defaultSession.cookies.set(setCookie));
  }
  return Promise.all(allCookies);
}
