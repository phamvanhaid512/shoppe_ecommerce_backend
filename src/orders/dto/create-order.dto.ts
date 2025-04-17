export class CreateOrderDto { }

export class OrdersProductDto {
    id: number;
    product_id: number;
    order_id: number;
    quantity: number;
    price: number;
}
