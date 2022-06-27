import { Button } from "antd";
import i18n from "i18next";
import React, { useState } from "react";

import { useNextLang } from "../i18n";

function HeaderButtons() {
  const [nextLang, nextLangLabel] = useNextLang();
  const [lang, setLang] = useState(nextLangLabel);

  const handleLangChange = () => {
    setLang(nextLangLabel);
    i18n.changeLanguage(nextLang);
    window.location.reload();
  };
  return (
    <Button type="text" icon={<span>{lang}</span>} onClick={handleLangChange} />
  );
}

export default HeaderButtons;
