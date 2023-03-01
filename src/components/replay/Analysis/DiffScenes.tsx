import { useRequest } from 'ahooks';
import { Col, Row, Tag, theme, Tooltip, Typography } from 'antd';
import { ColumnsType } from 'antd/es/table';
import React, { FC, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import ReplayService from '../../../services/Replay.service';
import { CategoryStatistic, Difference } from '../../../services/Replay.type';
import MenuSelect from '../../MenuSelect';
import { HighlightRowTable } from '../../styledComponents';

const DiffScenes: FC<{
  planItemId: string;
  onScenes?: (diff: Difference, category?: CategoryStatistic) => void;
  onSelectCategory?: (category: CategoryStatistic) => void;
}> = ({ planItemId, onScenes, onSelectCategory }) => {
  const { token } = theme.useToken();
  const { t } = useTranslation(['components']);

  const [selectedCategory, setSelectedCategory] = useState<CategoryStatistic>();
  const { data: differenceData = [], loading } = useRequest(
    () =>
      ReplayService.queryDifferences({
        categoryName: selectedCategory!.categoryName,
        operationName: selectedCategory!.operationName,
        planItemId,
      }),
    {
      ready: !!selectedCategory,
      refreshDeps: [selectedCategory],
    },
  );

  const categoryColumns: ColumnsType<Difference> = useMemo(
    () => [
      {
        title: t('replay.pointOfDifference'),
        dataIndex: 'differenceName',
        ellipsis: true,
        render: (text, record) => (
          <a onClick={() => handleRowClick(record)}>
            {text === '%baseMissing%'
              ? t('replay.baseMissing')
              : text === '%testMissing%'
              ? t('replay.testMissing')
              : text}
          </a>
        ),
      },
      {
        title: t('replay.sceneCount'),
        dataIndex: 'sceneCount',
        width: '110px',
      },
      {
        title: t('replay.caseTableCount'),
        dataIndex: 'caseCount',
        width: '110px',
      },
    ],
    [t],
  );

  const handleSelect = (item: CategoryStatistic) => {
    onSelectCategory && onSelectCategory(item);
    setSelectedCategory(item);
  };

  const handleRowClick = (record: Difference) => onScenes && onScenes(record, selectedCategory);

  return (
    <Row gutter={16}>
      <Col span={6} style={{ borderRight: `1px solid ${token.colorBorder}` }}>
        <MenuSelect<CategoryStatistic>
          small
          forceFilter
          defaultSelectFirst
          limit={10}
          rowKey='operationName'
          onSelect={handleSelect}
          placeholder={''}
          request={() => ReplayService.queryResponseTypeStatistic({ planItemId })}
          filter={(keyword, record) =>
            record.errorCaseCount + record.failCaseCount > 0 &&
            record.operationName.toLocaleLowerCase().includes(keyword.toLocaleLowerCase())
          }
          itemRender={(item: CategoryStatistic) => ({
            label: (
              <Typography.Text>
                <Tag>{item.categoryName}</Tag>
                {React.createElement(
                  item.operationName.split('.').length > 1 ? Tooltip : 'span',
                  { title: item.operationName },
                  item.operationName.split('.').at(-1),
                )}
              </Typography.Text>
            ),
            key: item.operationName,
          })}
          sx={`
            padding: 0;
          `}
        />
      </Col>

      <Col span={18}>
        <HighlightRowTable
          size='small'
          loading={loading}
          rowKey='differenceName'
          columns={categoryColumns}
          dataSource={differenceData}
          onRowClick={handleRowClick}
        />
      </Col>
    </Row>
  );
};

export default DiffScenes;
