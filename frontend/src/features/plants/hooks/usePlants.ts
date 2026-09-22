import {
  useEffect,
  useState,
} from "react";

import PlantService from "../services/plant.service";

import type { Plant } from "../types/plant";


export default function usePlants() {
  const [plants, setPlants] =
    useState<Plant[]>([]);

  const [loading, setLoading] =
    useState(true);


  async function load() {
    try {
      setLoading(true);

      const data =
        await PlantService.getAll();

      setPlants(data);
    }
    finally {
      setLoading(false);
    }
  }


  useEffect(() => {
    load();
  }, []);


  async function create(
    plant: Plant
  ) {
    await PlantService.create(
      plant
    );

    await load();
  }


  async function update(
    plant: Plant
  ) {
    await PlantService.update(
      plant
    );

    await load();
  }


  async function remove(
    id: string
  ) {
    await PlantService.delete(
      id
    );

    await load();
  }


  return {
    plants,

    loading,

    reload: load,

    create,

    update,

    remove,
  };
}