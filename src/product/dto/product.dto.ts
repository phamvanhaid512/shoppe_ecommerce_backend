export class CreateProductDto {
  name: string;
  logo: string;
  price: number;
  content: string;
  categoryId: number;
}

export class UpdateProductDto extends CreateProductDto { }
