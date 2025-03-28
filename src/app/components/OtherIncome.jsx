import React, { useState } from "react";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { supabase } from "@/app/utils/supabase/client";

const OtherIncome = ({ visible, onHide, onSuccess }) => {
  const [formData, setFormData] = useState({ amount: "", source: "", note: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    const { amount, source, note } = formData;
    const { error } = await supabase.from("income").insert([{ amount, source, note }]);
    setLoading(false);

    if (!error) {
      onSuccess(); // Refresh the income list
      onHide(); // Close the dialog
    } else {
      console.error("Error adding income:", error.message);
    }
  };

  return (
    <Dialog header="تۆمارکردنی داهات" visible={visible} onHide={onHide} modal>
      <div className="flex flex-col gap-4 p-4">
        <label className="block">بڕ</label>
        <InputText
          name="amount"
          type="number"
          value={formData.amount}
          onChange={handleChange}
          className="p-inputtext w-full"
        />

        <label className="block">سەرچاوە</label>
        <InputText
          name="source"
          type="text"
          value={formData.source}
          onChange={handleChange}
          className="p-inputtext w-full"
        />

        <label className="block">تێبینی</label>
        <InputText
          name="note"
          type="text"
          value={formData.note}
          onChange={handleChange}
          className="p-inputtext w-full"
        />

        <div className="flex justify-end gap-2 mt-4">
          <Button label="پاشگەزبوونەوە" className="p-button-text" onClick={onHide} />
          <Button label="خەزنکردن" className="p-button-primary" onClick={handleSubmit} loading={loading} />
        </div>
      </div>
    </Dialog>
  );
};

export default OtherIncome;
