import { Drawer, Space } from 'antd';
import React, { FC, ReactNode } from 'react';

import { CompareResultDetail } from '../../../services/Replay.type';
import { EmptyWrapper } from '../../styledComponents';
import DiffScenes from './DiffScenes';

export interface DIffDrawer {
  open: boolean;
  title?: string | ReactNode[];
  data?: CompareResultDetail | CompareResultDetail[];
  loading?: boolean;
  onClose: (open: false) => void;
}

const DiffCard: FC<DIffDrawer> = (props) => {
<<<<<<< HEAD
  const diffList = Array.isArray(props.data) ? props.data : [props.data];
=======
  const [activeLog, setActiveLog] = useState<DiffLog>();
  useEffect(() => {
    props.data?.logs?.length && setActiveLog((props.data.logs as DiffLog[])[0]);
  }, [props.data]);

  const diffJsonData = useMemo(
    () =>
      props.data?.diffResultCode
        ? activeLog
          ? {
              baseMsg: props.data.baseMsg,
              testMsg: props.data.testMsg,
              logs: [activeLog],
            }
          : undefined
        : {
            baseMsg: props.data?.baseMsg,
            testMsg: props.data?.testMsg,
            logs: [],
          },
    [props.data, activeLog],
  );

  const pathTitle = useCallback((pathPair: PathPair) => {
    const path =
      pathPair.leftUnmatchedPath.length >= pathPair.rightUnmatchedPath.length
        ? pathPair.leftUnmatchedPath
        : pathPair.rightUnmatchedPath;
    return (
      path.reduce((title, curPair, index) => {
        index && (title += '.');
        title += curPair.nodeName || `[${curPair.index}]`;
        return title;
      }, '') || 'root'
    );
  }, []);
>>>>>>> dc509a8 (fix: add default pathTitle)

  return (
    <Drawer
      destroyOnClose
      open={props.open}
      title={Array.isArray(props.data) ? props.title : props.data?.operationName}
      width='80%'
      onClose={() => props.onClose?.(false)}
    >
      <EmptyWrapper loading={props.loading} empty={!props.data}>
        <Space direction='vertical' size='large' style={{ width: '100%' }}>
          {diffList.map((data) => (
            <DiffScenes
              key={data?.id}
              height={diffList.length > 1 ? '400px' : '85vh'}
              data={data}
            />
          ))}
        </Space>
      </EmptyWrapper>
    </Drawer>
  );
};

export default DiffCard;
