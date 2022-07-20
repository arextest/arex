import {Button, Empty} from 'antd';
import {FC} from "react";

const PaneAreaEmpty:FC<any> = ({add}) => <Empty >
    <Button type="primary" onClick={()=>add()}>Create Now</Button>
</Empty>;

export default PaneAreaEmpty;
