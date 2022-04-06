import { FireFlyTokenPoolType } from '@photic/firefly-sdk-nodejs';
import { ArrayNotEmpty, IsEnum, IsInt, IsOptional, IsString, IsUUID, Min } from 'class-validator';
import { JSONSchema, validationMetadatasToSchemas } from 'class-validator-jsonschema';

export class FireFlyResponse {
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
  value: string;
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
  value: string;
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

export function schemas() {
  return validationMetadatasToSchemas({ refPointerPrefix: '#/components/schemas/' });
}
