import React from "react";
import H1 from "./h1";

type Props = {};

const Branding = (props: Props) => {
  return (
    <section>
      <H1>
        <span className="font-semibold">PetSoft</span>
      </H1>
      <p className="text-lg opacity-80">Manage your pet daycare with ease</p>
    </section>
  );
};

export default Branding;
