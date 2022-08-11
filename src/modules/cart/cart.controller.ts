import {
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';

import { AuthId, UserRole } from '../../decorators';
import { Cart } from './schemas';
import { CartProductDto, ChangeCountProductDto, ICart } from './dto';
import { CartQueryFilterDto } from './dto';
import { CartService } from './cart.service';
import { EventEnum } from '../../constants/event-enum';
import { OnEvent } from '@nestjs/event-emitter';
import { ProductDiscountEvent } from '../product/events/product-discount.event';
import { UserRoleEnum } from '../../constants';
import { UserRoleGuard } from '../../guards';

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

  @OnEvent(EventEnum.EVENT_PRODUCT_DISCOUNT)
  async handleProductDiscountEvent(
    productDiscountEvent: ProductDiscountEvent,
  ): Promise<ICart[]> {
    return await this.cartService.updateCartsByEvent(productDiscountEvent);
  }
}
