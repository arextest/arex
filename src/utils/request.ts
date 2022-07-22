function AgentAxios<T>(params: any) {

  return new Promise<T>((resolve) => {
    const tid = String(Math.random())
    window.postMessage(
      {
        type: "__AREX_EXTENSION_REQUEST__",
        tid:tid,
        payload: params
      },
      "*",
    );
    window.addEventListener("message", receiveMessage);
    function receiveMessage(ev: any) {
      if (ev.data.type === "__AREX_EXTENSION_RES__" && ev.data.tid == tid) {
        window.removeEventListener("message", receiveMessage, false);
        resolve(ev.data.res);
      }
    }
  });
}

export default AgentAxios;
