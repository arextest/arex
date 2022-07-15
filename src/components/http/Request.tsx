import {Breadcrumb, Input, Select} from "antd";
const { Option } = Select;
import {useMount} from 'ahooks'
import {RequestService} from "../../services/RequestService";

const HttpRequest = ({request}) => {


    return <div>
        <Breadcrumb>
            <Breadcrumb.Item>Home</Breadcrumb.Item>
            <Breadcrumb.Item>
                <a href="">Application Center</a>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
                <a href="">Application List</a>
            </Breadcrumb.Item>
            <Breadcrumb.Item>An Application</Breadcrumb.Item>
        </Breadcrumb>
        <Select defaultValue="lucy" style={{ width: 120 }} onChange={()=>{}}>
            <Option value="jack">Jack</Option>
            <Option value="lucy">Lucy</Option>
            <Option value="disabled" disabled>
                Disabled
            </Option>
            <Option value="Yiminghe">yiminghe</Option>
        </Select>
        <Input value={request?.address?.endpoint}/>
    </div>;
};

export default HttpRequest;
