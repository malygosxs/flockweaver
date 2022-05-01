import { $host, $authHost } from "./index";

export const addCardsById = async (cardsId) => {
    const response = await $authHost.post('api/card/bulk', cardsId)
    return response.data
}

export const updateCardsById = async (cardsId) => {
    const response = await $authHost.put('api/card/', cardsId)
    return response.data;
}