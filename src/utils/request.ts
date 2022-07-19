function AgentAxios<T>(params: any) {
  return new Promise<T>((resolve) => {
    window.postMessage(
      {
        type: "__AREX_EXTENSION_REQUEST__",
        payload: params,
      },
      "*",
    );
    window.addEventListener("message", receiveMessage);

    function receiveMessage(ev: any) {
      if (ev.data.type === "__AREX_EXTENSION_RES__") {
        window.removeEventListener("message", receiveMessage, false);
        resolve(ev.data.res);
      }
    }
  });
}

export default AgentAxios;
