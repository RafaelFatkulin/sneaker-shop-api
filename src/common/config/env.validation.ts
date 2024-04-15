import { plainToClass } from 'class-transformer';
import { IsEnum, IsString, validateSync } from 'class-validator';

class EnvironmentVariables {
  @IsString()
  JWT_ACCESS_TOKEN_EXPIRATION_TIME: string;

  @IsString()
  COOKIE_SECRET: string;

  @IsString()
  JWT_REFRESH_TOKEN_EXPIRATION_TIME: string;

  @IsString()
  JWT_ACCESS_TOKEN_PUBLIC_KEY: string;

  @IsString()
  JWT_ACCESS_TOKEN_PRIVATE_KEY: string;

  @IsString()
  JWT_REFRESH_TOKEN_PUBLIC_KEY: string;

  @IsString()
  JWT_REFRESH_TOKEN_PRIVATE_KEY: string;
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToClass(EnvironmentVariables, config, {
    enableImplicitConversion: true
  });
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validatedConfig;
}
