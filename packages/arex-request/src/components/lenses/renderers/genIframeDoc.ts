export function htmlDecode(str: string) {
  let s = '';
  if (str.length == 0) return '';
  s = str.replace(/&amp;/g, '&');
  s = s.replace(/&lt;/g, '<');
  s = s.replace(/&gt;/g, '>');
  s = s.replace(/&nbsp;/g, ' ');
  s = s.replace(/&#39;/g, "'");
  s = s.replace(/&quot;/g, '"');
  return s;
}
export const genIframeDoc = (processedTemplate: string, dataMap: string) => `<html>
            <head>
              <meta http-equiv=&quot;Content-Security-Policy&quot; content=&quot;default-src 'none'; script-src http: https: 'unsafe-inline'; style-src http: https: 'unsafe-inline' ; img-src http: https: data:; font-src http: https:; connect-src http: https:; media-src http: https:; object-src 'none'; child-src 'none'; frame-src 'none'&quot;>
              <style>
                html {
                  background: #fff;
                }
              </style>

              <script type=&quot;text/javascript&quot;>
                const id = window.name;
                const parent = window.parent;
                const namespace = 'visualizerFrame';
                const dataMap = ${dataMap}
                window.pm = {};
                window.pm['getData'] = function(cb) {
                  if(typeof cb === 'function' &amp;&amp; dataMap) {
                    const { error, data } = dataMap
                    cb(error, data)
                  }
                };

                // Initialize sandbox
                (function () {
                  function blockMethod(name) {
                    return () => console.error(&quot;Ignored call to '&quot; + name + &quot;()'.&quot;);
                  }

                  window['alert'] = blockMethod('alert'); window['confirm'] = blockMethod('confirm'); window['print'] = blockMethod('print'); window['prompt'] = blockMethod('prompt');
                  delete window['Worker']; window['Worker'] = undefined; delete window['indexedDB']; window['indexedDB'] = undefined;

                  let _navigator = {};
                  for (let key in navigator) {
                    const prop = navigator[key];
                    if (typeof prop !== 'object' &amp;&amp; typeof prop !== 'function') {
                      _navigator[key] = prop;
                    }
                  }
                  delete window.navigator;
                  window.navigator = _navigator;
                })();
              </script>
            </head>
            <body>
            ${processedTemplate}
            </body>
          </html>`;
