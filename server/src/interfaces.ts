import { FireFlyTokenPoolType } from '@photic/firefly-sdk-nodejs';
import {
  ArrayNotEmpty,
  IsDefined,
  IsEnum,
  IsInstance,
  IsInt,
  IsNumberString,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';
import { JSONSchema } from 'class-validator-jsonschema';

export class AsyncResponse {
  @IsString()
  type: string;

  @IsString()
  id: string;
}

export class BaseMessageFields {
  @IsString()
  @IsOptional()
  topic?: string;

  @IsString()
  @IsOptional()
  tag?: string;
}

export class BroadcastValue extends BaseMessageFields {
  @IsString()
  @IsOptional()
  value?: string;

  @IsObject()
  @IsOptional()
  jsonValue?: any;
}

export class BroadcastBlob extends BaseMessageFields {
  @IsString()
  @JSONSchema({ format: 'binary' })
  file: string;
}

export class PrivateValue extends BaseMessageFields {
  @IsString({ each: true })
  @ArrayNotEmpty()
  recipients: string[];

  @IsString()
  @IsOptional()
  value?: string;

  @IsObject()
  @IsOptional()
  jsonValue?: any;
}

export class PrivateBlob extends BaseMessageFields {
  @IsString({ each: true })
  @ArrayNotEmpty()
  recipients: string[];

  @IsString()
  @JSONSchema({ format: 'binary' })
  file: string;
}

export class Organization {
  @IsUUID()
  id: string;

  @IsString()
  did: string;

  @IsString()
  name: string;
}

export class Verifier {
  @IsString()
  did: string;

  @IsString()
  type: string;

  @IsString()
  value: string;
}

export class TokenPoolInput {
  @IsString()
  name: string;

  @IsString()
  symbol: string;

  @IsEnum(FireFlyTokenPoolType)
  type: FireFlyTokenPoolType;
}

export class TokenPool extends TokenPoolInput {
  @IsUUID()
  id: string;
}

export class TokenMint {
  @IsString()
  pool: string;

  @IsInt()
  @Min(0)
  amount: number;
}

export class TokenBurn extends TokenMint {
  @IsString()
  @IsOptional()
  tokenIndex?: string;
}

export class TokenTransfer extends TokenBurn {
  @IsString()
  to: string;
}

export class TokenBalance {
  @IsUUID()
  pool: string;

  @IsString()
  key: string;

  @IsNumberString()
  balance: string;

  @IsString()
  tokenIndex?: string;
}

export enum ContractInterfaceFormat {
  FFI = 'ffi',
  ABI = 'abi',
}

export class ContractInterface {
  @IsEnum(ContractInterfaceFormat)
  format: ContractInterfaceFormat;

  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  version?: string;

  @IsDefined()
  schema: any;
}

export class ContractAPI {
  @IsString()
  name: string;

  @IsString()
  interfaceName: string;

  @IsString()
  interfaceVersion: string;

  @IsString()
  address: string;
}

export class ContractAPIURLs {
  @IsString()
  openapi: string;

  @IsString()
  ui: string;
}

export class ContractAPILookup {
  @IsString()
  name: string;

  @IsInstance(ContractAPIURLs)
  urls: ContractAPIURLs;
}
