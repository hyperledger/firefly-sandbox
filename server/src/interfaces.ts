import { IsOptional, IsString } from 'class-validator';
import { JSONSchema, validationMetadatasToSchemas } from 'class-validator-jsonschema';

export class BroadcastRequest {
  @IsString()
  @IsOptional()
  topic?: string;

  @IsString()
  @IsOptional()
  tag?: string;

  @IsString()
  @IsOptional()
  value?: string;

  @IsOptional()
  @JSONSchema({ type: 'string', format: 'binary' })
  file?: string;
}

export function schemas() {
  return validationMetadatasToSchemas({ refPointerPrefix: '#/components/schemas/' });
}
