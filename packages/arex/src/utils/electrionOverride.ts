// override window.open to use electron shell.openExternal
window.open = window.shell?.openExternal
  ? (path) => {
      if (path) window.shell?.openExternal(path.toString());
      return null;
    }
  : window.open;
