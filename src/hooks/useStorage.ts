import { useEffect, useState } from "react";
import { Storage } from "@ionic/storage";

export function useStorage() {
  const [store, setStore] = useState<Storage>();

  useEffect(() => {
    const initStorage = async () => {
      const newStorage = new Storage({
        name: "tododb",
      });

      const store = await newStorage.create();
      setStore(store);
    };

    initStorage();
  }, []);

  return {
    store,
  };
}
