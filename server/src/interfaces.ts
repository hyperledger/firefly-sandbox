import {
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
  IsDefined,
  IsEnum,
  IsInstance,
  IsInt,
  IsNumberString,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
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

export class DatatypeDefinition {
  @IsString()
  name: string;

  @IsString()
  version: string;
}

export class BroadcastValue extends BaseMessageFields {
  @IsString()
  @IsOptional()
  value?: string;

  @IsObject()
  @IsOptional()
  jsonValue?: any;

  @IsObject()
  @IsOptional()
  datatype?: DatatypeDefinition;

  @IsString()
  @IsOptional()
  datatypename?: string;

  @IsString()
  @IsOptional()
  datatypeversion?: string;
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

  @IsString()
  @IsOptional()
  datatypename?: string;

  @IsString()
  @IsOptional()
  datatypeversion?: string;
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

export class TokenConfig {
  @IsString()
  address: string;
}

export class TokenPoolInput {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  symbol?: string;

  @IsString()
  type: 'fungible' | 'nonfungible';

  @IsOptional()
  config?: TokenConfig;

  @IsString()
  @IsOptional()
  address?: string;
}

export class TokenPool extends TokenPoolInput {
  @IsUUID()
  id: string;

  @IsInt()
  decimals: number;

  @IsBoolean()
  dataSupport: boolean;
}

export class TokenMintBurn extends BroadcastValue {
  @IsString()
  pool: string;

  @IsNumberString()
  amount: string;

  @IsObject()
  @IsOptional()
  message?: any;

  @IsString()
  @IsOptional()
  messagingMethod?: string;

  @IsString()
  @IsOptional()
  tokenIndex?: string;

  @IsString({ each: true })
  @IsOptional()
  recipients: string[];
}

export class MintBurnBlob extends TokenMintBurn {
  @IsString()
  @JSONSchema({ format: 'binary' })
  file: string;
}

export class TokenTransfer extends TokenMintBurn {
  @IsString()
  to: string;
}

export class TransferBlob extends TokenTransfer {
  @IsString()
  @JSONSchema({ format: 'binary' })
  file: string;
}

export class TokenBalance {
  @IsInstance(TokenPool)
  pool: TokenPool;

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
  @JSONSchema({ type: 'object' })
  schema: any;
}

export class ContractInterfaceEvent {
  @IsString()
  pathname: string;
}

export class ContractAPI {
  @IsString()
  name: string;

  @IsString()
  interfaceName: string;

  @IsString()
  interfaceVersion: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsString()
  @IsOptional()
  channel?: string;

  @IsString()
  @IsOptional()
  chaincode?: string;
}

export class ContractAPIURLs {
  @IsString()
  openapi?: string;

  @IsString()
  ui?: string;
}

export class ContractAPILookup {
  @IsString()
  name: string;

  @IsString()
  address: string;

  @IsInstance(ContractAPIURLs)
  urls: ContractAPIURLs;

  @IsInstance(ContractInterfaceEvent, { each: true })
  events?: ContractInterfaceEvent[];
}

export class ContractInterfaceLookup {
  @IsString()
  name: string;

  @IsString()
  version: string;
}

export class ContractListener {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  topic: string;

  @IsString()
  apiName: string;

  @IsString()
  eventPath: string;
}

export class ContractListenerLookup {
  @IsString()
  id: string;

  @IsString()
  name?: string;

  @IsString()
  topic: string;

  @IsString()
  address: string;

  @IsString()
  eventName: string;
}

export class Transaction {
  @IsString()
  id: string;

  @IsString()
  type: string;
}

export class Plugin {
  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsDefined()
  pluginType: string;
}

export class Plugins {
  @IsInstance(Plugin, {
    each: true,
  })
  @IsOptional()
  blockchain?: Plugin[];

  @IsInstance(Plugin, {
    each: true,
  })
  @IsOptional()
  tokens?: Plugin[];
}

export class DatatypeInterface {
  @IsString()
  @IsOptional()
  id?: string;

  @IsString()
  name: string;

  @IsString()
  version: string;

  @IsDefined()
  @JSONSchema({ type: 'object' })
  schema: any;
}
