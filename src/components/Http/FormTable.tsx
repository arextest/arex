import {
  CheckCircleOutlined,
  DeleteOutlined,
  StopOutlined,
} from "@ant-design/icons";
import styled from "@emotion/styled";
import { Button, Input, Space, Table, TableProps, Tooltip } from "antd";
import { ColumnsType } from "antd/es/table";
import { useTranslation } from "react-i18next";
import { Updater } from "use-immer";

import { ParamsType } from "./index";

const FormTable = styled(Table)<TableProps<ParamsType>>`
  .ant-table-thead {
    display: ${ props => props.showHeader ? 'table-header-group' : 'none' };
  }
  .ant-table-cell {
    padding: 0 1px !important;
  }
`;

export const getColumns = (
  update: Updater<ParamsType[]>
): ColumnsType<ParamsType> => {
  const { t } = useTranslation("common");
  const handleChange = (i: number, attr: "key" | "value", value: string) => {
    update((params) => {
      params[i][attr] = value;
    });
  };

  const handleDisable = (i: number) => {
    update((params) => {
      params[i].disabled = !params[i].disabled;
    });
  };

  return [
    {
      title: t("key"),
      dataIndex: "key",
      key: "key",
      render: (text, record, i) => (
        <Input
          value={text}
          bordered={false}
          placeholder={t("key")}
          disabled={record.disabled}
          onChange={(e) => handleChange(i, "key", e.target.value)}
        />
      ),
    },
    {
      title: t("value"),
      dataIndex: "value",
      key: "value",
      render: (text, record, i) => (
        <Input
          value={text}
          bordered={false}
          placeholder={t("value")}
          disabled={record.disabled}
          onChange={(e) => handleChange(i, "value", e.target.value)}
        />
      ),
    },
    {
      title: "操作",
      key: "actions",
      width: 72,
      align: "center",
      className: "actions",
      render: (text, record, i) => (
        <Space>
          <Tooltip title={record.disabled ? t("enable") : t("disable")}>
            <Button
              type="text"
              size="small"
              icon={
                record.disabled ? <StopOutlined /> : <CheckCircleOutlined />
              }
              onClick={() => handleDisable(i)}
            />
          </Tooltip>
          <Tooltip title={t("remove")}>
            <Button
              type="text"
              size="small"
              icon={<DeleteOutlined />}
              onClick={() =>
                update((params) => {
                  params.splice(i, 1);
                })
              }
            />
          </Tooltip>
        </Space>
      ),
    },
  ];
};

export default FormTable;
