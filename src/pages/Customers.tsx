import { Box, FormControl, FormLabel, Input, Button } from "@chakra-ui/react";
import Map from "react-map-gl";
import * as React from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useToast } from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";

export default function Customers() {
  const [latitude, setLatitude] = React.useState(0);
  const [longitude, setLongitude] = React.useState(0);

  const toast = useToast();

  const [formData, setFormData] = React.useState({
    username: "",
    latitude: 0,
    longitude: 0,
  });

  const onmove1 = (evt: any) => {
    const { latitude, longitude } = evt;
    setLatitude(latitude);
    setLongitude(longitude);
  };

  const handleInputChange = (event: any) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const onsubmit1 = async () => {
    formData.latitude = latitude;
    formData.longitude = longitude;
    onsubmit2.mutate();
  };

  const onsubmit2 = useMutation({
    mutationFn: async () => {
      const response = await axios.post(
        `http://localhost:3000/api/entry/`,
        formData
      );
      return response.data;
    },
    onSuccess: () => {
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

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = useForm();

  return (
    <Box display="flex">
      <Box m="50" w="50%" h="500">
        <Map
          onMove={(evt) => onmove1(evt.viewState)}
          mapStyle="mapbox://styles/mapbox/streets-v9"
          style={{ width: "100%", height: "100%" }}
          mapboxAccessToken={`${process.env.REACT_APP_MAPBOX_TOKEN}`}
        />
      </Box>
      <Box m="50" w="50%">
        <form onSubmit={handleSubmit(onsubmit1)}>
          <FormControl id="email" isRequired>
            <FormLabel>Name</FormLabel>
            <Input
              type="name"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
            />
          </FormControl>
          <FormControl id="email" isRequired>
            <FormLabel>Latitude</FormLabel>
            <Input
              type="latitude"
              name="latitude"
              value={latitude}
              onChange={handleInputChange}
            />
          </FormControl>
          <FormControl id="email" isRequired>
            <FormLabel>Longitude</FormLabel>
            <Input
              type="longitude"
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
