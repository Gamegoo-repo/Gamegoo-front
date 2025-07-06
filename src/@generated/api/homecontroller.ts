import Axios from "@/api";

import type { ApiResponse } from "../types";

/* getHome - 조회 */
export const getHome = async (): Promise<ApiResponse<string>> => {
  const endpoint = "/home";
  try {
    const response = await Axios.get(endpoint);
    return response.data;
  } catch (error) {
    console.error("getHome failed:", error);
    throw error;
  }
};

/* getHealthcheck - 조회 */
export const getHealthcheck = async (): Promise<ApiResponse<string>> => {
  const endpoint = "/healthcheck";
  try {
    const response = await Axios.get(endpoint);
    return response.data;
  } catch (error) {
    console.error("getHealthcheck failed:", error);
    throw error;
  }
};

/* getErrortest - 조회 */
export const getErrortest = async (): Promise<ApiResponse<any>> => {
  const endpoint = "/errortest";
  try {
    const response = await Axios.get(endpoint);
    return response.data;
  } catch (error) {
    console.error("getErrortest failed:", error);
    throw error;
  }
};
