//locations.tsx

import { CheckIcon, CloseIcon, EditIcon } from "@chakra-ui/icons";
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  Editable,
  EditableInput,
  EditablePreview,
  Input,
  useEditableControls,
  ButtonGroup,
  IconButton,
  Flex,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

// Define the Location interface
interface Location {
  _id: string;
  username: string;
  latitude: number;
  longitude: number;
}

export default function Locations() {
  // API endpoint
  const API: string = "http://localhost:3000/api/entry";

  // Hooks for notifications and query management
  const toast = useToast();
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(1);

  // Function to fetch locations from the API
  const fetchLocations = async (): Promise<Location[]> => {
    const response = await axios.get(API);
    return response.data.entries;
  };

  // useQuery to get locations data
  const {
    data: locations,
    isLoading,
    isError,
  } = useQuery<Location[]>({
    queryKey: ["Locations"],
    queryFn: fetchLocations,
  });

  // Mutation to update location
  const updateLocation = useMutation({
    mutationFn: async (data: Location) => {
      const response = await axios.put(API + `/${data._id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Locations"] });
      toast({
        title: "Update Success.",
        description: "Entry got Updated",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    },
    onError: () => {
      toast({
        title: "Update Failed.",
        description: "Entry could not be updated, please try again",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    },
  });

  // Mutation to delete location
  const deleteLocation = useMutation({
    mutationFn: async (id: string) => {
      const response = await axios.delete(API + `/${id}`);
      return response.data;
    },
    onSuccess: (_, id) => {
      queryClient.setQueryData<Location[]>(["Locations"], (oldData) =>
        oldData ? oldData.filter((entry) => entry._id !== id) : []
      );
      toast({
        title: "Delete Success.",
        description: "Entry got deleted",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    },
    onError: () => {
      toast({
        title: "Delete Failed.",
        description: "Entry could not be deleted, please try again",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    },
  });

  // Editable controls for each table cell
  const EditableControls = () => {
    const {
      isEditing,
      getSubmitButtonProps,
      getCancelButtonProps,
      getEditButtonProps,
    } = useEditableControls();

    return isEditing ? (
      <ButtonGroup justifyContent="center" size="sm">
        <IconButton
          size="sm"
          icon={<CheckIcon />}
          aria-label="Submit"
          {...getSubmitButtonProps()}
        />
        <IconButton
          size="sm"
          icon={<CloseIcon />}
          aria-label="Cancel"
          {...getCancelButtonProps()}
        />
      </ButtonGroup>
    ) : (
      <Flex justifyContent="center">
        <IconButton
          size="sm"
          icon={<EditIcon />}
          aria-label="Edit"
          {...getEditButtonProps()}
        />
      </Flex>
    );
  };

  // Pagination logic
  const totalEntries = locations?.length || 0;
  const entriesPerPage = 7; // Static entries per page
  const totalPages = Math.ceil(totalEntries / entriesPerPage);
  const currentEntries = locations?.slice(
    (currentPage - 1) * entriesPerPage,
    currentPage * entriesPerPage
  );

  return (
    <Box mt={30} width="90" ml={100} mr={100} height="90%">
      <Table variant="striped" colorScheme="blue" size="sm">
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th>Latitude</Th>
            <Th>Longitude</Th>
            <Th>Action</Th>
          </Tr>
        </Thead>
        <Tbody>
          {isError ? (
            <Tr>
              <p>Error Loading Locations</p>
            </Tr>
          ) : isLoading ? (
            <Tr>
              <p>Loading ... </p>
            </Tr>
          ) : (
            currentEntries?.map((item) => (
              <Tr key={item._id}>
                <Td>
                  <Editable
                    defaultValue={item.username}
                    onSubmit={(newName) =>
                      updateLocation.mutate({ ...item, username: newName })
                    }
                  >
                    <EditablePreview />
                    <Input as={EditableInput} />
                    <EditableControls />
                  </Editable>
                </Td>
                <Td>{item.latitude}</Td>
                <Td>{item.longitude}</Td>
                <Td>
                  <Button
                    colorScheme="red"
                    size="sm"
                    onClick={() => deleteLocation.mutate(item._id)}
                  >
                    Delete
                  </Button>
                </Td>
              </Tr>
            ))
          )}
        </Tbody>
      </Table>
      <Flex justifyContent="space-between" mt={4}>
        <Button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          isDisabled={currentPage === 1}
        >
          Previous
        </Button>
        <Box>
          Page {currentPage} of {totalPages}
        </Box>
        <Button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          isDisabled={currentPage === totalPages}
        >
          Next
        </Button>
      </Flex>
    </Box>
  );
}
