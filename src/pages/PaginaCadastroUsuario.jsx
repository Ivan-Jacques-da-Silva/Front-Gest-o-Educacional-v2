import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import CadastroUsuario from "../components/CadastroUsuario";



const PaginaCadastroUsuario = () => {
  return (
    <>

      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
        <Breadcrumb title="Cadastro" />

        {/* FormPageLayer */}
        {/* <FormPageLayer /> */}
        <CadastroUsuario />

      </MasterLayout>

    </>
  );
};

export default PaginaCadastroUsuario;
