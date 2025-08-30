import TokenService from './TokenService';
import type { TokenPurchaseResponse, PollingOrderStatusResponse, CommonResponse } from './TokenService';

const postTokenPurchase = async (data: { tokenPackageId: string }) => {
  const response = await TokenService.postTokenPurchase(data);
  return response.data;
};

const pollingOrderStatus = async (orderId: string) => {
  const response = await TokenService.pollingOrderStatus(orderId);
  return response.data;
};

export { postTokenPurchase, pollingOrderStatus };
export type { TokenPurchaseResponse as QrData };
