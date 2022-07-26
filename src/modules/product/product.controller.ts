import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFiles,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';

import { ProductService } from './product.service';
import {
  CreateProductDto,
  ProductQueryFilterDto,
  UpdateProductDto,
} from './dto';
import { ArrayFiles } from '../../decorators';
import { AuthId, UserRole } from '../../decorators';
import { FilesUploadDto } from './dto';
import { IProduct } from './dto';
import { Product } from './schemas/product-schema';
import { UserRoleEnum } from '../../constants';
import { UserRoleGuard } from '../../guards';
import { ValidatorMongoIdPipe } from '../../pipes/validator-mongo-id.pipe';

@ApiTags('Product')
@UserRole(UserRoleEnum.ADMIN)
@UseGuards(UserRoleGuard)
@Controller('product')
export class ProductController {
  constructor(private productService: ProductService) {}

  @ApiOperation({ summary: 'Create product' })
  @ApiCreatedResponse({
    type: Product,
    status: 201,
  })
  @ApiSecurity('access-key')
  @ApiBody({ type: CreateProductDto })
  @UserRole(UserRoleEnum.MANAGER)
  @Post('')
  async createProduct(
    @AuthId() authId: string,
    @Body() createProductDto: CreateProductDto,
  ): Promise<IProduct> {
    return await this.productService.createProduct(createProductDto, authId);
  }

  @ApiOperation({ summary: 'Update product' })
  @ApiOkResponse({
    type: Product,
  })
  @ApiNotFoundResponse()
  @ApiForbiddenResponse()
  @ApiBadRequestResponse()
  @ApiSecurity('access-key')
  @ApiBody({ type: UpdateProductDto })
  @UserRole(UserRoleEnum.MANAGER)
  @Put('update/:id')
  async updateProduct(
    @Param('id') productId: string,
    @AuthId() authId: string,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<IProduct> {
    return await this.productService.updateProductById(
      updateProductDto,
      authId,
      productId,
    );
  }

  @ApiOperation({ summary: 'Add array of photos' })
  @ApiResponse({ status: 201, type: Product })
  @ApiSecurity('access-key')
  @UserRole(UserRoleEnum.MANAGER)
  @ArrayFiles()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Photo file list',
    type: FilesUploadDto,
  })
  @Post('upload/:id')
  async setProductImages(
    @AuthId() authId: string,
    @Param('id') productId: string,
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<IProduct> {
    return await this.productService.addProductImageFiles(
      authId,
      productId,
      files,
    );
  }

  @ApiOperation({ summary: 'Get all products' })
  @ApiOkResponse({ type: [Product] })
  @ApiSecurity('access-key')
  @ApiBody({ type: [Product] })
  @UserRole(UserRoleEnum.MANAGER, UserRoleEnum.USER)
  @Get('')
  async getAllProducts(): Promise<IProduct[]> {
    return await this.productService.getProducts();
  }

  @ApiOperation({ summary: 'Get product' })
  @ApiOkResponse()
  @ApiNotFoundResponse()
  @ApiForbiddenResponse()
  @ApiBadRequestResponse()
  @ApiBody({ type: Product })
  @ApiSecurity('access-key')
  @UserRole(UserRoleEnum.MANAGER)
  @Get('/:id')
  async getProductById(
    @Param('id', ValidatorMongoIdPipe) productId: string,
  ): Promise<IProduct> {
    return await this.productService.getProduct(productId);
  }

  @ApiOperation({ summary: 'Delete product' })
  @ApiOkResponse({ type: Product })
  @ApiForbiddenResponse()
  @ApiNotFoundResponse()
  @ApiBadRequestResponse()
  @ApiSecurity('access-key')
  @Delete(':id')
  async deleteProduct(
    @Param('id', ValidatorMongoIdPipe) productId: string,
    @AuthId() authId,
  ): Promise<IProduct> {
    return await this.productService.removeProductById(productId, authId);
  }

  @ApiOperation({ summary: 'Filter products' })
  @ApiOkResponse({ type: [Product] })
  // @ApiQuery({ type: ProductQueryFilterDto })
  @ApiForbiddenResponse()
  @ApiNotFoundResponse()
  @ApiBadRequestResponse()
  @ApiSecurity('access-key')
  @Get('filter/query')
  async getProductsByFilter(
    @Query() productQueryFilterDto: ProductQueryFilterDto,
  ): Promise<IProduct[]> {
    return await this.productService.getProductsByFilter(productQueryFilterDto);
  }
}
