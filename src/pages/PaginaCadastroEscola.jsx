import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import CadastroEscola from "../components/CadastroEscola.jsx";



const PaginaCadastroEscola = () => {
  return (
    <>

      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
        <Breadcrumb title="Cadastro" />

        {/* FormPageLayer */}
        {/* <FormPageLayer /> */}
        <CadastroEscola />

      </MasterLayout>

    </>
  );
};

export default PaginaCadastroEscola;
