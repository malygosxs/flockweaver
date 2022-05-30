import { $host } from "./index";


/** returns arr[] of error strings, if all validated then array with empty strings */
export const validateCodes = async (codes, lng) => {
    const response = await $host.get('api/decode/validate', {params: {codes}})
    return response.data
}

export const createUuid = async (codes) => {
    const response = await $host.post('api/decode/newuuid', codes)
    return response.data;
}

export const getCards = async (url) => {
    const response = await $host.get('api/decode/decks', {params: {url}})
    return response.data
}

export const getDeck = async (deckstring) => {
    const response = await $host.get('api/decode/deck', {params: {deckstring}})
    return response.data
}