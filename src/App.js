import { WrappedMap } from './components/Map';

import './App.css';

function App() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
        <WrappedMap 
          googleMapURL={``}
          loadingElement={<div style={{ height: '100%' }} />}
          containerElement={<div style={{ height: '100%'}} />}
          mapElement={<div style={{ height: '100%'}} />}
        />
    </div>
  );
}

export default App;
