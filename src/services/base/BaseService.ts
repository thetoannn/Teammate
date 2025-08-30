import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

const baseConfig: AxiosRequestConfig = {
  baseURL: 'https://teammate.nhansuso.vn',
  headers: {
    'Content-Type': 'application/json',
  },
};

const createAxiosInstance = () => {
  const instance = axios.create(baseConfig);
  return instance;
};

const axiosInstance = createAxiosInstance();

export const BaseCoreService = async <T = any, D = any>(
  config: AxiosRequestConfig<D>
): Promise<AxiosResponse<T>> => {
  try {
    const response = await axiosInstance({
      ...config,
    });
    return response;
  } catch (error) {
    throw error;
  }
};
