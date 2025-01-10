import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import CadastroTurma from "../components/CadastroTurma.jsx";



const PaginaCadastroTurma = () => {
  return (
    <>

      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
        <Breadcrumb title="Cadastro" />

        {/* FormPageLayer */}
        {/* <FormPageLayer /> */}
        <CadastroTurma />

      </MasterLayout>

    </>
  );
};

export default PaginaCadastroTurma;
