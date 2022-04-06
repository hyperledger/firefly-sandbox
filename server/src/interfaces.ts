import { IsOptional, IsString } from 'class-validator';
import { JSONSchema, validationMetadatasToSchemas } from 'class-validator-jsonschema';

export class MessageResponse {
  @IsString()
  id: string;
}

export class BroadcastValue {
  @IsString()
  @IsOptional()
  topic?: string;

  @IsString()
  @IsOptional()
  tag?: string;

  @IsString()
  value: string;

  file?: never;
}

export class BroadcastBlob {
  @IsString()
  @IsOptional()
  topic?: string;

  @IsString()
  @IsOptional()
  tag?: string;

  @IsString()
  @JSONSchema({ format: 'binary' })
  file: string;

  value?: never;
}

export function schemas() {
  return validationMetadatasToSchemas({ refPointerPrefix: '#/components/schemas/' });
}
