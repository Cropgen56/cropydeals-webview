import AddFieldMap from "../components/addfield/Addfield";
import { useState } from "react";

const AddField = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  if (isSubmitting) {
    return <div>loading...</div>;
  }

  return <AddFieldMap setIsSubmitting={setIsSubmitting} />;
};

export default AddField;
