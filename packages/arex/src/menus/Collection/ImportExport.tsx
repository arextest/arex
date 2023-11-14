import { useTranslation } from '@arextest/arex-core';
import { css } from '@emotion/react';
import { Button, Divider, message, Modal, Radio, RadioChangeEvent } from 'antd';
import { FC, useState, useTransition } from 'react';
import { useParams } from 'react-router-dom';

import { exportCollection } from '@/services/FileSystemService/collection/exportCollection';
import { importCollection } from '@/services/FileSystemService/collection/importCollection';
import { useCollections } from '@/store';

import useWorkspaces from '../../store/useWorkspaces';
interface CollectionsImportExportProps {
  show: boolean;
  onHideModal: () => void;
}
function download(content: string, filename: string) {
  // 创建a标签
  const eleLink = document.createElement('a');
  // 设置a标签 download 属性，以及文件名
  eleLink.download = filename;
  // a标签不显示
  eleLink.style.display = 'none';
  // 获取字符内容，转为blob地址
  const blob = new Blob([content]);
  // blob地址转为URL
  eleLink.href = URL.createObjectURL(blob);
  // a标签添加到body
  document.body.appendChild(eleLink);
  // 触发a标签点击事件，触发下载
  eleLink.click();
  // a标签从body移除
  document.body.removeChild(eleLink);
}
const CollectionsImportExport: FC<CollectionsImportExportProps> = ({ show, onHideModal }) => {
  const { getCollections } = useCollections();
  const { activeWorkspaceId } = useWorkspaces();
  const [fileString, setFileString] = useState('');
  const { t } = useTranslation(['components']);
  const submit = () => {
    importCollection({
      workspaceId: activeWorkspaceId,
      type: importType,
      path: [],
      importString: fileString,
    })
      .then((res) => {
        if (res) {
          message.success(t('workSpace.importSuccess'));
          getCollections();
        } else {
          message.error(t('workSpace.importFailed'));
        }
      })
      .catch((err) => {
        message.error(t('workSpace.importFailed'));
      });
  };
  const [importType, setImportType] = useState(1);

  const onChange = (e: RadioChangeEvent) => {
    setImportType(e.target.value);
  };
  return (
    <Modal
      title={t('collection.import_export')}
      width={400}
      open={show}
      onCancel={onHideModal}
      footer={false}
    >
      <div
        css={css`
          display: flex;
          flex-direction: column;
          padding-top: 10px;
        `}
      >
        <Radio.Group
          onChange={onChange}
          value={importType}
          css={css`
            margin-bottom: 10px;
          `}
        >
          <Radio value={1}>AREX</Radio>
          <Radio value={2}>Postman</Radio>
        </Radio.Group>
        <input
          css={css`
            margin-bottom: 20px;
          `}
          type={'file'}
          onChange={(event) => {
            if (event.target.files !== null) {
              event.target.files[0].text().then((res) => {
                setFileString(res);
              });
            }
          }}
        />
        <Button
          type={'primary'}
          onClick={() => {
            submit();
          }}
        >
          {t('workSpace.import')}
        </Button>
        <Divider
          css={css`
            margin: 10px 0;
          `}
        />
        <Button
          onClick={() => {
            // 暂只支持arex导出
            exportCollection({
              workspaceId: activeWorkspaceId,
              type: importType,
              path: [],
            }).then((res) => {
              download(res, `${activeWorkspaceId}.json`);
            });
          }}
        >
          {t('collection.export')}
        </Button>
      </div>
    </Modal>
  );
};

export default CollectionsImportExport;
