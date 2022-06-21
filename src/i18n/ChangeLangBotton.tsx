import { Button } from "antd";
import i18n from "i18next";
import React, { useState } from "react";

import { local, useLocalGenerator } from "../i18n";

function HeaderButtons() {
  const [lng, setLng] = useState(local.get(i18n.language));
  const nextLng = useLocalGenerator();

  const handleLangChange = () => {
    const nl = nextLng();
    setLng(nl[1]);
    i18n.changeLanguage(nl[0]).then(() => {
      console.log(i18n.language);
    });
  };
  return (
    <Button type="text" icon={<span>{lng}</span>} onClick={handleLangChange} />
  );
}

export default HeaderButtons;
