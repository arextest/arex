import {useState} from "react";
import Button from '@mui/material/Button';

const Http = () => {
  const [count, setCount] = useState(0);
  return <div style={{fontStyle:'12px'}}>
    <Button variant="contained">Contained</Button>
    <Button variant="contained" disabled>
      Disabled
    </Button>
    <Button variant="contained" href="#contained-buttons">
      Link
    </Button>
  </div>;
};

export default Http;
