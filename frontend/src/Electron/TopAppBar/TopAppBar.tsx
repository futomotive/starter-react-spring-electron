import React, { ReactNode } from "react";
import { WindowControls } from "../WindowControls/WindowControls";
import "./TopAppBar.css";

interface Props {
  logo?: ReactNode;
  title?: string;
  children?: ReactNode | ReactNode[];
}

export function TopAppBar({ logo, title, children }: Props) {
  return (
    <header id="TopAppBar">
      {logo && <div id="TopAppBar-Logo">{logo}</div>}
      {title && <div id="TopAppBar-Title">{title}</div>}
      {children}
      <WindowControls />
    </header>
  );
}
