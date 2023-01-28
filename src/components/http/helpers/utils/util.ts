export const urlPretreatment = (url: string, envs: { key: string; value: string }[]) => {
  const editorValueMatch = url.match(/\{\{(.+?)\}\}/g) || [''];
  for (let j = 0; j < editorValueMatch.length; j++) {
    let replaceVar = editorValueMatch[j];
    for (let i = 0; i < envs.length; i++) {
      if (envs[i].key === editorValueMatch[j].replace('{{', '').replace('}}', '')) {
        replaceVar = envs[i].value;
        url = url.replace(editorValueMatch[j], replaceVar);
      }
    }
  }
  return url;
};
