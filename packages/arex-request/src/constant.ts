export const TIMEOUT_REQUEST = 60000;
export const TIMEOUT_SCRIPT = 20000;
export const AREX_EXTENSION_CHROME_STORE_UEL =
  'https://chromewebstore.google.com/detail/arex-chrome-extension/jmmficadjneeekafmnheppeoehlgjdjj';

// electron client
export const isClient = !!window.electron;
export const isClientDev = isClient && import.meta.env.DEV;
export const isClientProd = isClient && import.meta.env.PROD;
