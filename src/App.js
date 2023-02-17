import React from 'react';
import RouteTree from './components/RouteTree';
import { QueryClient, QueryClientProvider } from 'react-query';
import "./index.css";

function App() {
  const queryClient = new QueryClient();
  
  return (
    <div className="App">
      <QueryClientProvider client={queryClient}>
      <RouteTree/>
      </QueryClientProvider>
      
    </div>
  );
}

export default App;
