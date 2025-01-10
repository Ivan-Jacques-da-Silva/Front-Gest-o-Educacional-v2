import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import CadastroMatricula from "../components/CadastroMatricula.jsx";



const PaginaCadastroMatricula = () => {
  return (
    <>

      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
        <Breadcrumb title="Cadastro" />

        {/* FormPageLayer */}
        {/* <FormPageLayer /> */}
        <CadastroMatricula />

      </MasterLayout>

    </>
  );
};

export default PaginaCadastroMatricula;
