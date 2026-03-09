import React from "react";
import MainDetailspage from "../_components/MainDetailspage";

const page = ({ params }: { params: { id: string } }) => {
  return (
    <div>
      <MainDetailspage id={params.id} />
    </div>
  );
};

export default page;
