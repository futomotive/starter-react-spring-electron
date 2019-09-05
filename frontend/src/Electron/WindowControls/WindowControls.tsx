import React from "react";
import "./WindowControls.css";
import { isElectron } from "../isElectron";

/**
 * Renders Windows10-style window controls if running in Electron.
 *
 * Make sure you include WindowControls
 */
export function WindowControls() {
  if (isElectron()) {
    return (
      <div id="WindowControls">
        <div className="button" id="WindowControls-MinButton" />
        <div className="button" id="WindowControls-MaxButton" />
        <div className="button" id="WindowControls-RestoreButton" />
        <div className="button" id="WindowControls-CloseButton" />
      </div>
    );
  } else {
    return null;
  }
}
