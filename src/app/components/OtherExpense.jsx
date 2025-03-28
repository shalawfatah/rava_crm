"use client";

import React, { useState } from "react";
import { Dialog } from "primereact/dialog";
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";

const OtherExpenseDialog = ({ visible, onHide, onSubmit }) => {
  const [amount, setAmount] = useState(null);
  const [description, setDescription] = useState("");

  const handleSubmit = () => {
    if (!amount || description.trim() === "") return;
    onSubmit(amount, description);
    setAmount(null);
    setDescription("");
  };

  return (
    <Dialog
      visible={visible}
      onHide={onHide}
      header="زیادکردنی خەرجی"
      modal
      className="w-96"
      dir="rtl"
    >
      <div className="flex flex-col gap-4">
        <label className="font-semibold">بڕ</label>
        <InputNumber
          value={amount}
          onValueChange={(e) => setAmount(e.value)}
          mode="decimal"
          min={1}
          className="w-full"
        />

        <label className="font-semibold">تێبینی</label>
        <InputText
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="تێبینی بنووسە..."
          className="w-full"
        />

        <Button
          label="تۆمارکردن"
          icon="pi pi-check"
          className="p-button-success w-full"
          onClick={handleSubmit}
          disabled={!amount || description.trim() === ""}
        />
      </div>
    </Dialog>
  );
};

export default OtherExpenseDialog;
