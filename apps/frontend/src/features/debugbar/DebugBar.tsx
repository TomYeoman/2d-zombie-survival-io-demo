import React, { useState } from "react";

import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { clickKillButton } from "./debugbarSlice";

export function DebugBar() {
  const debuggerInfo = useAppSelector((state) => state.debugBar);

  const dispatch = useAppDispatch();

  return (
    <div className="text-white flex-col p-2 fixed top-80 left-2 w-80 select-none bg-opacity-50 border-grey bg-gray-600 m-1 border-2">
      <button
              type="button"
              className="w-full inline-flex justify-center rounded-md border focus:ring-1 focus:ring-offset-1 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
              onClick={() => { dispatch(clickKillButton(true)) }}
            >
              Test
            </button>

    </div>
  );
}
