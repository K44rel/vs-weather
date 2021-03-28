import { writable } from "svelte/store";

export const weatherList = (() => {
  const { subscribe, update } = writable([]);

  return {
    subscribe,
    add: (weatherInfo: any) => update((weathers) => [...weathers, weatherInfo]),
    remove: (idx: number) =>
      update((weathers) => {
        weathers.splice(idx, 1);
        return weathers;
      }),
  };
})();
