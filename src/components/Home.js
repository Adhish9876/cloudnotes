import Notes from "./Notes";
import React, { useState } from "react";
import Navbar from "./Navbar";

const Home = ({ showAlert }) => {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("Newest");

  return (
    <>
      <Navbar search={search} setSearch={setSearch} sort={sort} setSort={setSort} />
      <div className="pt-8 bg-[#191A23] min-h-screen">
        <div className="max-w-5xl mx-auto px-2 sm:px-4 flex flex-col gap-4">
          <Notes showAlert={showAlert} search={search} setSearch={setSearch} sort={sort} setSort={setSort} />
        </div>
      </div>
    </>
  );
};

export default Home;
