"use client";

import { useSearchContext } from "@/lib/hooks";
import React, { useState } from "react";

type Props = {};

const SearchForm = (props: Props) => {
  const { searchQuery, handleChangeSeachQuery } = useSearchContext();

  return (
    <form className="w-full h-full">
      <input
        type="search"
        className="w-full h-full bg-white/20 rounded-md px-5 outline-none transition focus:bg-white/50 howver:bg-white/30 placeholder:text-white/50"
        placeholder="Search for a pet"
        value={searchQuery}
        onChange={(e) => handleChangeSeachQuery(e.target.value)}
      />
    </form>
  );
};

export default SearchForm;
