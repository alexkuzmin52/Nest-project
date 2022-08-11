import {
  ApiBody,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';

import { AuthId, UserRole } from '../../decorators';
import { Cart } from './schemas';
import {
  CartProductDto,
  CartQueryFilterDto,
  ChangeCountProductDto,
  ICart,
} from './dto';
import { CartService } from './cart.service';
import { EventEnum } from '../../constants/event-enum';
import { OnEvent } from '@nestjs/event-emitter';
import { ProductDiscountEvent } from '../product/events/product-discount.event';
import { UserRoleEnum } from '../../constants';
import { UserRoleGuard } from '../../guards';
import { ValidatorMongoIdPipe } from '../../pipes/validator-mongo-id.pipe';

@ApiTags('Cart')
@Controller('cart')
export class CartController {
  constructor(private cartService: CartService) {}

  @ApiSecurity('access-key')
  @ApiOperation({ summary: 'Add product to Cart' })
  @ApiCreatedResponse({ type: Cart })
  @ApiBody({ type: CartProductDto })
  @Post('product/add')
  async addProductToCartCo(
    @AuthId() authId: string,
    @Body() cartProductDto: CartProductDto,
  ): Promise<any> {
    return await this.cartService.addProductToCartDto(cartProductDto, authId);
  }

  @ApiSecurity('access-key')
  @ApiOperation({ summary: 'Get user Cart' })
  @ApiOkResponse({ type: Cart })
  @Get('')
  async getUserCart(@AuthId() authId: string): Promise<ICart> {
    return await this.cartService.getUserCartByUserId(authId);
  }

  @ApiSecurity('access-key')
  @ApiOperation({ summary: 'Change count of Product' })
  @ApiOkResponse({ type: Cart })
  @Put('product/count')
  async changeProductCart(
    @AuthId() authId: string,
    @Body() changeCountProductDto: ChangeCountProductDto,
  ): Promise<ICart> {
    return await this.cartService.changeCountOfProductCart(
      authId,
      changeCountProductDto,
    );
  }

  @ApiSecurity('access-key')
  @ApiOperation({ summary: 'Get carts by filter' })
  @ApiOkResponse({ type: [Cart] })
  @UserRole(UserRoleEnum.ADMIN, UserRoleEnum.MANAGER)
  @UseGuards(UserRoleGuard)
  @Get('filter')
  async getCartsByFilter(
    @AuthId() authId: string,
    @Query() cartQueryFilterDto: CartQueryFilterDto,
  ): Promise<ICart[]> {
    return await this.cartService.getAllCartsByFilter(cartQueryFilterDto);
  }

  @ApiSecurity('access-key')
  @ApiOperation({ summary: 'Delete cart' })
  @UserRole(UserRoleEnum.ADMIN, UserRoleEnum.MANAGER)
  @UseGuards(UserRoleGuard)
  @ApiOkResponse({ type: Cart, description: 'Deleted Cart' })
  @ApiNotFoundResponse({ description: 'Cart not found' })
  @Delete('/:id')
  async deleteUserCart(
    @Param('id', ValidatorMongoIdPipe) cartId: string,
  ): Promise<ICart> {
    return await this.cartService.deleteUserCartById(cartId);
  }

  @ApiSecurity('access-key')
  @ApiOperation({ summary: 'Remove product from cart' })
  @UserRole(UserRoleEnum.ADMIN, UserRoleEnum.MANAGER, UserRoleEnum.USER)
  @UseGuards(UserRoleGuard)
  @ApiOkResponse({ type: Cart, description: 'Updated cart' })
  @ApiNotFoundResponse({ description: 'Product not found' })
  @Delete('product/:id')
  async removeCartProduct(
    @AuthId() userId: string,
    @Param('id', ValidatorMongoIdPipe) productId: string,
  ): Promise<ICart> {
    return await this.cartService.removeCartProductById(userId, productId);
  }

  @OnEvent(EventEnum.EVENT_PRODUCT_DISCOUNT)
  async handleProductDiscountEvent(
    productDiscountEvent: ProductDiscountEvent,
  ): Promise<ICart[]> {
    return await this.cartService.updateCartsByEvent(productDiscountEvent);
  }
}
