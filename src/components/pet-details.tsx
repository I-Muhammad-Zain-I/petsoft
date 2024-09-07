"use client";
import { usePetContext } from "@/lib/hooks";
import Image from "next/image";
import React from "react";
import { PetType } from "../../types";
import PetButton from "./pet-button";

const PetDetails = () => {
  const { selectedPet } = usePetContext();

  return (
    <div className="flex flex-col w-full h-full">
      {!selectedPet ? (
        <div className="h-full flex justify-center items-center">
          <EmptyView />
        </div>
      ) : (
        <>
          <TopBar selectedPet={selectedPet} />

          <OtherInfo selectedPet={selectedPet} />

          <Notes selectedPet={selectedPet} />
        </>
      )}
    </div>
  );
};

export default PetDetails;

type Props = {
  selectedPet: PetType | undefined;
};

const EmptyView = () => {
  return <p className="text-2xl font-medium">No Pet Selected</p>;
};

const TopBar = ({ selectedPet }: Props) => {
  const { handleCheckoutPet } = usePetContext();

  return (
    <div className="flex items-center bg-white px-8 py-5 border-b border-light">
      <Image
        src={selectedPet?.imageUrl ?? ""}
        alt="Selected Pet Image"
        height={75}
        width={75}
        className="h-[75px] w-[75px] rounded-full object-cover"
      />
      <h2 className="text-3xl font-semibold leading-7 ml-5">
        {selectedPet?.name}
      </h2>
      <div className="ml-auto space-x-3">
        <PetButton actionType="edit" onClick={() => {}}>
          Edit
        </PetButton>
        <PetButton
          actionType="checkout"
          onClick={() => handleCheckoutPet(selectedPet?.id)}
        >
          Checkout
        </PetButton>
      </div>
    </div>
  );
};

const OtherInfo = ({ selectedPet }: Props) => {
  return (
    <div className="flex justify-around py-10 px-5 text-center">
      <div>
        <h3 className="text-[13px] font-medium uppercase text-zinc-700">
          Owner Name
        </h3>
        <p className="mt-1 text-lg text-zinc-800">{selectedPet?.ownerName}</p>
      </div>
      <div>
        <h3 className="text-[13px] font-medium uppercase text-zinc-700">Age</h3>
        <p className="mt-1 text-lg text-zinc-800">{selectedPet?.age}</p>
      </div>
    </div>
  );
};

const Notes = ({ selectedPet }: Props) => {
  return (
    <section className="bg-white px-7 py-5 rounded-md mb-9 mx-8 flex-1 border-b border-light">
      {selectedPet?.notes}
    </section>
  );
};
