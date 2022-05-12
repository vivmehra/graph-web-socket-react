import './App.css';
import { io } from 'socket.io-client';
import { useState, useRef, useEffect } from 'react';
import DoughnutChart from './components/DoughnutChart';

const initState = [];
function App() {
  const socket = useRef();
  const [socketData, setSocketData] = useState(initState);

  useEffect(() => {
    socket.current = io('ws://localhost:9013');

    socket.current.on('connnection', () => {
      console.log('connected to server');
    });
    socket.current.on('updatedData', (message) => {
      console.log('updated data', message)
      setSocketData(message);
    });
    socket.current.on('initalData', (message) => {
      console.log('initalData', message)
      setSocketData(message);
    });
  }, []);
  return (
    <div className='App'>
      <div className='container'>
        <div className='chart'>
       <DoughnutChart tableData={socketData}/>
        </div>
      </div>
    </div>
  );
}

export default App;
