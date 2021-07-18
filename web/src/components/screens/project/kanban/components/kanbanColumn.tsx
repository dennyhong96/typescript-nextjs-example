import { LegacyRef, MutableRefObject, ReactNode, useState } from "react";
import {
  Divider,
  Heading,
  Stack,
  Box,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  Text,
  Flex,
} from "@chakra-ui/react";

import { IKanban } from "@localTypes/kanban";
import { ITask } from "@localTypes/task";
import useTasks from "@hooks/useTasks";
import useTaskTypes from "@hooks/useTaskTypes";
import useTaskModal from "@hooks/useTaskModal";
import useDeleteKanbans from "@hooks/useDeleteKanbans";
import useKanbansQueryKey from "@hooks/useKanbansQueryKey";
import useTasksSearchParams from "@hooks/useTasksSearchParams";
import MarkKeyword from "@components/markKeyword";
import Modal from "@components/modal";
import CreateTask from "./createTask";

export const ColumnContainer = ({ children }: { children: ReactNode }) => {
  return (
    <Stack
      minWidth="20rem"
      borderRadius={6}
      background="rgb(244,245,247)"
      paddingTop={6}
      paddingBottom={6}
      paddingLeft={4}
      paddingRight={4}
    >
      {children}
    </Stack>
  );
};

export const TaskContainer = ({
  children,
  containerRef,
  onClick = () => {}, // eslint-disable-line
}: {
  children: ReactNode;
  containerRef?: MutableRefObject<HTMLElement | undefined>;
  onClick?: () => void;
}) => {
  return (
    <Stack
      onClick={onClick}
      ref={containerRef as LegacyRef<HTMLDivElement> | undefined}
      direction="row"
      align="center"
      background="white"
      padding={4}
      borderRadius={4}
      cursor="pointer"
    >
      {children}
    </Stack>
  );
};

export const TaskCard = ({ task }: { task: ITask }) => {
  const [params] = useTasksSearchParams();
  const { data: taskTypes } = useTaskTypes();
  const { open } = useTaskModal();
  const taskType = taskTypes?.find((tt) => tt.id === task.typeId)?.name;

  return taskType ? (
    <TaskContainer key={task.id} onClick={() => open(task.id)}>
      <MarkKeyword name={task.name} keyword={params.name ?? ""} />
      <Box height={4} width={4}>
        <img src={`/assets/icons/${taskType}.svg`} alt={taskType} />
      </Box>
    </TaskContainer>
  ) : null;
};

const KanbanMoreMenu = ({ kanban }: { kanban: IKanban }) => {
  const { mutateAsync: deleteKanban } = useDeleteKanbans(useKanbansQueryKey());
  const [isOpen, setIsOpen] = useState(false);

  const handleRemoveKanban = async () => {
    await deleteKanban(kanban.id);
    setIsOpen(false);
  };

  return (
    <Menu>
      <MenuButton as={Button} size="sm" variant="ghost">
        ...
      </MenuButton>
      <MenuList>
        <MenuItem onClick={() => setIsOpen(true)}>Delte Kanban</MenuItem>
        <Modal
          title="Delete Kanban"
          isOpen={isOpen}
          onConfirm={handleRemoveKanban}
          onClose={() => setIsOpen(false)}
          confirmLabel="Delete"
        >
          <Text>Are you sure you want to delete Kanban: {kanban.name}?</Text>
        </Modal>
      </MenuList>
    </Menu>
  );
};

const KanbanColumn = ({ kanban }: { kanban: IKanban }) => {
  const { data: tasks } = useTasks();

  return (
    <ColumnContainer>
      <Flex alignItems="center" justifyContent="space-between">
        <Heading size="md">{kanban.name}</Heading>
        <KanbanMoreMenu kanban={kanban} />
      </Flex>

      <Box paddingTop={2} paddingBottom={2}>
        <Divider />
      </Box>

      <Stack
        flex="1"
        overflow="auto"
        css={`
          /* Hide scrollbar for Chrome, Safari and Opera */
          ::-webkit-scrollbar {
            display: none;
          }
          /* Hide scrollbar for IE, Edge and Firefox */
          -ms-overflow-style: none; /* IE and Edge */
          scrollbar-width: none; /* Firefox */
        `}
      >
        {tasks
          ?.filter((task) => task.kanbanId === kanban.id)
          .map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}

        <CreateTask kanbanId={kanban.id} />
      </Stack>
    </ColumnContainer>
  );
};

export default KanbanColumn;
