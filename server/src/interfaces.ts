import { IsOptional, IsString } from 'class-validator';

export class BroadcastRequest {
  @IsOptional()
  topic?: string;

  @IsOptional()
  tag?: string;

  @IsString()
  value: string;
}
