"use client";
import React, { ReactNode, useState } from "react";
import { createContext } from "react";
import { Pet } from "@prisma/client";

type SearchContextProviderProps = {
  children: ReactNode;
};

type SearchContextType = {
  searchQuery: string;
  handleChangeSeachQuery: (query: string) => void;
};

export const SearchContext = createContext<SearchContextType>({
  searchQuery: "",
  handleChangeSeachQuery: (query: string) => {},
});

const SearchContextProvider = ({ children }: SearchContextProviderProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleChangeSeachQuery = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <SearchContext.Provider
      value={{
        searchQuery,
        handleChangeSeachQuery,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export default SearchContextProvider;
