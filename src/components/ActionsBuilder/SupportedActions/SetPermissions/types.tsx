import { BigNumber } from 'ethers';

export interface ParsedDataInterface {
  asset: string;
  to: string;
  functionSignature: string;
  valueAllowed: BigNumber;
  allowance: boolean;
  functionName: string;
  tab?: number;
}

export interface ValidationsInterface {
  asset: boolean;
  to: boolean;
  valueAllowed: boolean;
  functionName: boolean;
}

export enum TABS {
  ASSET_TRANSFER = 0,
  FUNCTION_CALL = 1,
}
