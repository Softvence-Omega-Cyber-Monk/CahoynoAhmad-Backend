import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNotEmpty, IsNumber, IsString, ArrayNotEmpty, IsOptional } from "class-validator";

export class CreatePlanDto {
  @ApiProperty({
    example: "Premium Plan",
    description: "The name of the subscription plan",
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 199.99,
    description: "The price of the plan",
  })
  @IsNumber()
  @IsNotEmpty()
  price: number;

  @ApiProperty({
    example: "Access to all premium features and tools",
    description: "Short description of the plan",
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    example: 30,
    description: "Duration of the plan in days",
  })
  @IsNumber()
  @IsNotEmpty()
  duration: number;

  @ApiProperty({
    example: ["Unlimited Projects", "Priority Support", "Advanced Analytics"],
    description: "List of features included in this plan",
    type: [String],
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  features: string[];

  @ApiProperty({
    example: "price_1SQgZIER98NUaoU4hb9Trupz",
    description: "Stripe price ID for this plan",
  })
  @IsString()
  @IsNotEmpty()
  priceId: string;
}
