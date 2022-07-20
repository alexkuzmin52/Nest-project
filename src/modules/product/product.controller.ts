import {
  Body,
  Controller,
  Param,
  Post,
  UploadedFiles,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOperation,
  ApiResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto';
import { IProduct } from './dto';
import { ArrayFiles } from '../../decorators/array-files.decorator';
import { UserRoleGuard } from '../../guards';
import { AuthId, UserRole } from '../../decorators';
import { UserRoleEnum } from '../../constants';
import { Product } from './schemas/product-schema';
import { FilesUploadDto } from './dto';

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
    // description: 'Product successfully created',
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

  @ApiOperation({ summary: 'Set array of photos' })
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
}
