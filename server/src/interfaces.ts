import { IsOptional, IsString, IsUUID } from 'class-validator';
import { JSONSchema, validationMetadatasToSchemas } from 'class-validator-jsonschema';

export class MessageResponse {
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

export class SendValue extends BaseMessageFields {
  @IsString({ each: true })
  recipients: string[];

  @IsString()
  value: string;
}

export class Organization {
  @IsUUID()
  id: string;

  @IsString()
  did: string;

  @IsString()
  name: string;
}

export function schemas() {
  return validationMetadatasToSchemas({ refPointerPrefix: '#/components/schemas/' });
}
