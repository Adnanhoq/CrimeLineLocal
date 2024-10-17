import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './Home';
import NewInvestigation from './newInvestigation';
import CaseDetail from './caseDetail';


interface FormData {
  leadInvestigator: string;
  caseName: string;
  date: string;
  type: string;
  investigators: string;
  description: string;
}


const App: React.FC = () => {
  const [cases, setCases] = useState<FormData[]>([]);

  const addCase = (newCase: FormData) => {
    setCases([...cases, newCase]);
  };

  return (
    <>
      <Routes>
        <Route path="/" element={<Home cases={cases} />} />
        <Route path="/new-investigation" element={<NewInvestigation addCase={addCase} />} />
        <Route path="/case/:caseName" element={<CaseDetail />} />
      </Routes>
    </>
  );
};

export default App;
