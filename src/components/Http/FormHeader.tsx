import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";
import styled from "@emotion/styled";
import { Button, Tooltip } from "antd";
import { useTranslation } from "react-i18next";
import { Updater } from "use-immer";
import { v4 as uuidv4 } from "uuid";

export type ParamsType = {
  id: string;
  key: string;
  value: string | number;
  disabled: boolean;
};
export const FormHeaderWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  position: relative;
  top: -8px;
  & > span:first-of-type {
    font-size: 13px;
    line-height: 32px;
    font-weight: 500;
    color: #9d9d9d;
  }
`;

function FormHeader(props: { update: Updater<ParamsType[]> }) {
  const { t: t_common } = useTranslation("common");
  const { t: t_components } = useTranslation("components");

  const handleAddParam = () => {
    const newValue: ParamsType = {
      id: uuidv4(),
      key: "",
      value: "",
      disabled: false,
    };
    props.update((state) => {
      state.push(newValue);
    });
  };

  const handleClearAllParams = () => props.update([]);

  return (
    <FormHeaderWrapper>
      <span>{t_components("http.queryParams")}</span>
      <div>
        <Tooltip title={t_common("help")}>
          <Button type="text" icon={<QuestionCircleOutlined />} />
        </Tooltip>

        <Tooltip title={t_common("clearAll")}>
          <Button
            type="text"
            icon={<DeleteOutlined />}
            onClick={handleClearAllParams}
          />
        </Tooltip>

        <Tooltip title={t_common("batchEdit")}>
          <Button type="text" icon={<EditOutlined />} />
        </Tooltip>

        <Tooltip title={t_common("add")}>
          <Button
            type="text"
            icon={<PlusOutlined />}
            onClick={handleAddParam}
          />
        </Tooltip>
      </div>
    </FormHeaderWrapper>
  );
}

export default FormHeader;
