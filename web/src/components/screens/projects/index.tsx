import React, { FC } from "react";
import { Box, Heading, Text } from "@chakra-ui/react";

import useURLQueryParams from "@hooks/useURLQueryParams";
import useProjects from "@hooks/useProjects";
import useUsers from "@hooks/useUsers";
import List from "./components/list";
import SearchPanel from "./components/search-panel";
import useDebounce from "@hooks/useDebounce";

export interface IUser {
  id: string;
  name: string;
  email: string;
}

export interface IProject {
  id: string;
  name: string;
  organization: string;
  personId: string;
  created: string;
}

const ProjectsScreen: FC = () => {
  const [param, setParam] = useURLQueryParams(["name", "personId"]);
  const debouncedParam = useDebounce(param, 200);

  const { users } = useUsers();
  const { projects, isLoading, error } = useProjects(debouncedParam);

  console.log({ param });
  console.log({ projects });
  console.log({ users });

  return (
    <Box padding={4}>
      <Heading mb={4}>Projects List</Heading>

      <SearchPanel param={param} setParam={setParam} users={users ?? []} />

      {error ? (
        <Text color="red" fontSize="md">
          {error.message}
        </Text>
      ) : null}

      <List list={projects ?? []} users={users ?? []} isLoading={isLoading} />
    </Box>
  );
};

export default ProjectsScreen;
