//customers.tsx

import { Box, FormControl, FormLabel, Input, Button } from "@chakra-ui/react";
import Map, { ViewState } from "react-map-gl";
import * as React from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useToast } from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";

export default function Customers() {
  const API = "http://localhost:3000/api/entry"; // API endpoint

  // State variables for latitude, longitude, and form data
  const [latitude, setLatitude] = React.useState(0);
  const [longitude, setLongitude] = React.useState(0);

  const toast = useToast(); // Hook for toast notifications

  const [formData, setFormData] = React.useState({
    username: "",
    latitude: 0,
    longitude: 0,
  });

  // Handler for map movement to update latitude and longitude
  const onMove = (evt: ViewState) => {
    const { latitude, longitude } = evt;
    setLatitude(latitude);
    setLongitude(longitude);
  };

  // Handler for input changes in the form

  //type FormData = {username: string; latitude: number; longitude: number; }
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Form submission handler
  const handleSubmitForm = async () => {
    formData.latitude = latitude;
    formData.longitude = longitude;
    submitMutation.mutate(); // Trigger mutation for form submission
  };

  // Mutation for submitting form data
  const submitMutation = useMutation({
    mutationFn: async () => {
      const response = await axios.post(API, formData);
      return response.data;
    },
    onSuccess: () => {
      toast({
        title: "Submission Success.",
        description: "Entry has been successfully added.",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
      formData.username = "";
      setLatitude(0);
      setLongitude(0);
    },
    onError: () => {
      toast({
        title: "Submission Failed.",
        description: "Entry could not be added, please try again.",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    },
  });

  // Hook for form handling
  const {
    handleSubmit,
    formState: { isSubmitting },
  } = useForm();

  return (
    <Box display="flex">
      <Box m="50" w="50%" h="500">
        {/* Map component to select location */}
        <Map
          onMove={(evt) => onMove(evt.viewState)}
          mapStyle="mapbox://styles/mapbox/streets-v9"
          style={{ width: "100%", height: "100%" }}
          mapboxAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
        />
      </Box>
      <Box m="50" w="50%">
        {/* Form for user input */}
        <form onSubmit={handleSubmit(handleSubmitForm)}>
          <FormControl id="name" isRequired>
            <FormLabel>Name</FormLabel>
            <Input
              type="text"
              name="username"
              value={formData.username}
              onChange={(e) => handleInputChange}
            />
          </FormControl>
          <FormControl id="latitude" isRequired>
            <FormLabel>Latitude</FormLabel>
            <Input
              type="number"
              name="latitude"
              value={latitude}
              onChange={handleInputChange}
            />
          </FormControl>
          <FormControl id="longitude" isRequired>
            <FormLabel>Longitude</FormLabel>
            <Input
              type="number"
              name="longitude"
              value={longitude}
              onChange={handleInputChange}
            />
          </FormControl>
          <Button
            mt={4}
            colorScheme="teal"
            isLoading={isSubmitting}
            type="submit"
          >
            Submit
          </Button>
        </form>
      </Box>
    </Box>
  );
}
