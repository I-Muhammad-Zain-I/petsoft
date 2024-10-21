"use client";

import Branding from "@/components/branding";
import ContentBlock from "@/components/content-block";
import PetButton from "@/components/dashboard/pet-button";
import PetDetails from "@/components/dashboard/pet-details";
import PetList from "@/components/dashboard/pet-list";
import SearchForm from "@/components/dashboard/search-form";
import Stats from "@/components/dashboard/stats";
import React from "react";
import style from "@/components/dashboard/scroll.module.css";

const DashboardPage = () => {
  return (
    <main>
      <div className="flex items-center justify-between text-white py-8">
        <Branding />
        <Stats />
      </div>

      <div className="grid md:grid-cols-3 md:grid-rows-[45px_1fr] grid-rows-[45px_300px_500px] gap-4 md:h-[600px]">
        <div className="md:row-start-1 md:row-span-1 md:col-start-1 md:col-span-1">
          <SearchForm />
        </div>

        <div className="relative md:row-start-2 md:row-span-full md:col-start-1 md:col-span-1">
          <ContentBlock className="bg-white">
            <div className={style.scroll}>
              <PetList />
            </div>
            <div className="absolute bottom-4 right-4">
              <PetButton actionType="add" onClick={() => {}}>
                Add
              </PetButton>
            </div>
          </ContentBlock>
        </div>
        <div className="md:row-start-1 md:row-span-full md:col-start-2 md:col-span-full">
          <ContentBlock>
            <PetDetails />
          </ContentBlock>
        </div>
      </div>
    </main>
  );
};

export default DashboardPage;
