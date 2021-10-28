import React, { useState } from "react";

import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { changeSlot } from "./toolbarSlice";

export function Toolbar() {
  const selectedSlot = useAppSelector((state) => state.toolbar.selectedSlot);
  const slotData = useAppSelector((state) => state.toolbar.slotData);

  const dispatch = useAppDispatch();

  return (
    <div className="flex p-2 fixed bottom-2 left-2 select-none">
      {slotData.map((data, index) => {
        return (
            <div className={`
                m-1 border-2 bg-opacity-50 ${selectedSlot === index ? "border-white border-4 bg-gray-200" : "border-grey bg-gray-600"}
            `}>
            <div style={{ backgroundImage:`url(${data.image})` }} className="h-20 w-20 bg-center" onClick={() => dispatch(changeSlot(index))}>
                    {/* <img src={data.image} alt="" className="object-cover" /> */}
                </div>

          </div>
        );
      })}
    </div>
  );
}
