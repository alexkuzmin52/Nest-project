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

import { CartService } from './cart.service';
import { AuthId, UserRole } from '../../decorators';
import { Cart } from './schemas';
import { CartProductDto } from './dto';
import { CartQueryFilterDto } from './dto/cart-query-filter.dto';
import { ChangeCountProductDto } from './dto';
import { ICart } from './dto';
import { UserRoleEnum } from '../../constants';
import { UserRoleGuard } from '../../guards';

@ApiTags('Cart')
// @ApiSecurity('access-key')
// @UserRole(UserRoleEnum.ADMIN, UserRoleEnum.MANAGER, UserRoleEnum.USER)
// @UseGuards(UserRoleGuard)
@Controller('cart')
export class CartController {
  constructor(private cartService: CartService) {}
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

  @ApiOperation({ summary: 'Get user Cart' })
  @ApiOkResponse({ type: Cart })
  @Get('')
  async getUserCart(@AuthId() authId: string): Promise<ICart> {
    return await this.cartService.getUserCartByUserId(authId);
  }

  @ApiOperation({ summary: 'Change count of Product' })
  @ApiOkResponse({ type: Cart })
  @Put('product/change')
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
  @UserRole(UserRoleEnum.ADMIN)
  @UseGuards(UserRoleGuard)
  @Get('filter')
  async getCartsByFilter(
    @AuthId() authId: string,
    @Query() cartQueryFilterDto: CartQueryFilterDto,
  ): Promise<ICart[]> {
    return await this.cartService.getAllCartsByFilter(
      authId,
      cartQueryFilterDto,
    );
  }
}
