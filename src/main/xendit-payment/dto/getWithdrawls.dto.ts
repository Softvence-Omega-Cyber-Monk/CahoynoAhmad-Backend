import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsOptional, IsNumber } from "class-validator";
import { WithdrawStatus } from "generated/prisma";
import { Type } from "class-transformer";

export class GetWithdrawlsDto {
  
  @ApiPropertyOptional({
    description: "Filter by withdrawal status",
    enum: WithdrawStatus,
    example: "PENDING",
  })
  @IsEnum(WithdrawStatus)
  @IsOptional()
  status?: WithdrawStatus;

  @ApiPropertyOptional({
    description: "Page number",
    example: 1,
  })
  @IsOptional()
  @Type(() => Number) // converts query string to number
  @IsNumber()
  page?: number;

  @ApiPropertyOptional({
    description: "Limit number",
    example: 10,
  })
  @IsOptional()
  @Type(() => Number) // converts query string to number
  @IsNumber()
  limit?: number;
}
