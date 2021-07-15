import { QueryKey, useMutation } from "react-query";

import { db } from "@lib/firebase";
import { IProject } from "@components/screens/projects";
import { useOptimisticEdit } from "./useOptimisticOptions";

const useEditProject = (queryKey: QueryKey) => {
  return useMutation((params: Partial<IProject>) => {
    const { id, ...restParams } = params;
    return db
      .collection("projects")
      .doc(id)
      .set({ ...restParams }, { merge: true });
  }, useOptimisticEdit(queryKey));
};

export default useEditProject;
