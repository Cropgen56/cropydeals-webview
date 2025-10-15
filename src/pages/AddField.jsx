import AddFieldMap from "../components/addfield/Addfield";
import { useState } from "react";
import Loading from "../components/common/Loader";

const AddField = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  if (isSubmitting) {
    return <Loading/>;
  }

  return <AddFieldMap setIsSubmitting={setIsSubmitting} />;
};

export default AddField;
