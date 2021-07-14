import { FC } from "react";
import NextLink from "next/link";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Box,
  Link,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
} from "@chakra-ui/react";
import dayjs from "dayjs";
import HashLoader from "react-spinners/HashLoader";
import { css } from "@emotion/react";

import Star from "@components/star";
import { IProject, IUser } from "../index";
import useEditProject from "@hooks/useEditProject";
import useProjectModal from "@hooks/useProjectModal";

interface IListProps {
  list: IProject[];
  users: IUser[];
  isLoading: boolean;
}

const List: FC<IListProps> = (props) => {
  const { editProject } = useProjectModal();
  const { list, users, isLoading } = props;
  const { mutate } = useEditProject();

  const handleEditProject = (id: string) => async (pin: boolean) => mutate({ id, pin });

  // TODO: use React Table with sorting
  return (
    <Box position="relative" minHeight={250}>
      <Table
        variant="simple"
        opacity={isLoading ? 0.5 : 1}
        pointerEvents={isLoading ? "none" : "all"}
      >
        <Thead>
          <Tr>
            <Th>Favorite</Th>
            <Th>Name</Th>
            <Th>Orgnization</Th>
            <Th>Person</Th>
            <Th>Created At</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {list.map((project: IProject, idx) => (
            <Tr key={`${project.name}-${idx}`}>
              <Td>
                <Star onClick={handleEditProject(project.id)} pinned={!!project.pin} />
              </Td>
              <Td>
                <NextLink href={`/projects/${project.id}/kanban`} passHref>
                  <Link color="teal">{project.name}</Link>
                </NextLink>
              </Td>
              <Td>{project.organization}</Td>
              <Td>
                {users.find((u: IUser) => u.id === project.personId)?.name ?? "No user assigned"}
              </Td>
              <Td>{dayjs(project.created).format("MM-DD-YYYY")}</Td>
              <Td>
                <Menu>
                  <MenuButton as={Button} size="sm" variant="ghost">
                    ...
                  </MenuButton>
                  <MenuList>
                    <MenuItem onClick={() => editProject(project.id)}>Edit Project</MenuItem>
                    <MenuItem onClick={() => editProject(project.id)}>Delete Project</MenuItem>
                  </MenuList>
                </Menu>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      <HashLoader
        loading={isLoading}
        size={25}
        css={css`
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        `}
      />
    </Box>
  );
};

export default List;
