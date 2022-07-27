import { MenuSelect, Replay as ReplayMain } from '../components';
const ReplayPage = ({ data }) => {
  console.log(data, 'data');
  return (
    <div>
      <ReplayMain curApp={data.curApp} />
    </div>
  );
};

export default ReplayPage;
