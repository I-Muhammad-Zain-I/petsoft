"use client";
import React from "react";
import { logout } from "@/server/actions/user-actions";
import { Button } from "../ui/button";

const SignOutBtn = () => {
  return <Button onClick={async () => await logout()}>Sign Out</Button>;
};

export default SignOutBtn;
