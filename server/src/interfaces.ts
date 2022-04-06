import { IsOptional, IsString } from 'class-validator';
import { JSONSchema, validationMetadatasToSchemas } from 'class-validator-jsonschema';

export class BroadcastRequestWithValue {
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

export class BroadcastRequestWithFile {
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
