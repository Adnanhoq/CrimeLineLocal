import Card from './components/Card.tsx';
import CrimeLineHeader from './components/Header.tsx';
import CrimeLineFooter from './components/Footer.tsx';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';


interface FormData {
    id: string;
    caseName: string;
    type: string;
    description: string;
  }

function Home() {
    const navigate = useNavigate();

    const location = useLocation();
    const newCase = location.state?.formData;

    const [cases, setCases] = useState<FormData[]>(() => {
        const savedCases = localStorage.getItem('cases');
        return savedCases ? JSON.parse(savedCases) : [
          { id: '1', caseName: 'Bank_Robbery', type: 'Robber', description: 'Caps Bank was robbed on Monday 14th October 2024' }
        ];
      });
    
      useEffect(() => {
        if (newCase) {
          setCases(prevCases => {
            const caseExists = prevCases.some(caseData => caseData.id === newCase.id);
            if (!caseExists) {
              const updatedCases = [...prevCases, newCase];
              localStorage.setItem('cases', JSON.stringify(updatedCases));
              return updatedCases;
            }
            return prevCases;
          });
        }
      }, [newCase]);

      useEffect(() => {
        const deleteCaseName = ''; // Replace with the name of the case you want to delete
        setCases(prevCases => {
          const updatedCases = prevCases.filter(caseData => caseData.caseName !== deleteCaseName);
          localStorage.setItem('cases', JSON.stringify(updatedCases));
          return updatedCases;
        });
      }, []);

      const handleCardClick = (caseName: string) => {
        navigate(`/case/${caseName}`);
    };

      
    
  return (
    <div className="flex flex-col min-h-screen">
        <CrimeLineHeader title="Crime Line" showButton={true} navigatePath={"/new-investigation"} buttonText={"Create New Investigations"} />
        <div className="flex-grow flex flex-col p-10">
            <div className='flex justify-center'>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-44">
                    {cases.map((caseData, index) => (
                    <Card
                        key={index}
                        caseName={caseData.caseName}
                        type={caseData.type}
                        description={caseData.description}
                        onClick={() => handleCardClick(caseData.caseName)}
                    />
                    ))}
                </div>
            </div>
        </div>
        <CrimeLineFooter />
    </div>
    
  );
}

export default Home;
