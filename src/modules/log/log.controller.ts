import {
  ApiOkResponse,
  ApiOperation,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { Controller, Get, Query, UseGuards } from '@nestjs/common';

import { ILog } from './dto';
import { Log } from './schemas/log-schema';
import { LogFilterQueryDto } from './dto';
import { LogService } from './log.service';
import { UserRole } from '../../decorators';
import { UserRoleEnum } from '../../constants';
import { UserRoleGuard } from '../../guards';

@ApiTags('Logs')
@UserRole(UserRoleEnum.ADMIN)
@UseGuards(UserRoleGuard)
@Controller('log')
export class LogController {
  constructor(private logService: LogService) {}

  @ApiOperation({ summary: 'Get all logs' })
  @ApiOkResponse({ type: [Log] })
  @ApiSecurity('access-key')
  @Get('')
  async getAllLogs(): Promise<ILog[]> {
    return await this.logService.getLogs();
  }

  @ApiOperation({ summary: 'Get logs by filter' })
  @ApiOkResponse({ type: [Log] })
  @ApiSecurity('access-key')
  @Get('filter')
  async getLogsByFilter(@Query() filter: LogFilterQueryDto): Promise<ILog[]> {
    return await this.logService.getFilteredLogs(filter);
  }
}
