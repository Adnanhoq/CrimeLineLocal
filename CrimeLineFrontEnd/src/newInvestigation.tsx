import React from "react";
import CrimeLineHeader from "./components/Header";
import CrimeLineFooter from "./components/Footer";
import CaseForm from "./components/CaseForm";

interface newInvestigationFormData {
  id: string;
  caseName: string;
  type: string;
  description: string;
}

interface NewInvestigationProps {
  addCase: (formData: newInvestigationFormData) => void;
}

const NewInvestigation: React.FC<NewInvestigationProps> = ({ addCase }) => {
  const handleFormSubmit = (formData: newInvestigationFormData) => {
    addCase(formData);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <CrimeLineHeader
        title="Create a new case"
        showButton={true}
        navigatePath={"/"}
        buttonText={"Home"}
      />
      <div className="flex-grow flex flex-col p-10">
        <CaseForm onSubmit={handleFormSubmit} />
      </div>
      <CrimeLineFooter />
    </div>
  );
};

export default NewInvestigation;
