import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  UseGuards,
  Request,
  Put,
  Delete,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { OrganizationService } from './organization.service';
import { InviteUserDto } from './dto/organization.dto';

@Controller('organization')
@UseGuards(AuthGuard('jwt'))
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) {}

  @Post()
  async createOrganization(
    @Body() body: { name: string; description: string },
    @Request() req: any,
  ) {
    const userId = req.user?._id;
    if (!userId) {
        throw new UnauthorizedException('User not authenticated');
      }
    const organization = await this.organizationService.createOrganization(
      body,
      userId,
    );
    return { organization_id: organization._id };
  }

  @Get(':organization_id')
  async getOrganization(@Param('organization_id') organizationId: string) {
    return this.organizationService.getOrganizationById(organizationId);
  }

  @Get()
  async getAllOrganizations() {
    return this.organizationService.getAllOrganizations();
  }

  @Put(':organization_id')
  async updateOrganization(
    @Param('organization_id') organizationId: string,
    @Body() body: { name: string; description: string },
  ) {
    return this.organizationService.updateOrganization(organizationId, body);
  }

  @Delete(':organization_id')
  async deleteOrganization(@Param('organization_id') organizationId: string) {
    await this.organizationService.deleteOrganization(organizationId);
    return { message: 'Organization deleted successfully' };
  }

  @Post(':organization_id/invite')
  async inviteUser(
      @Param('organization_id') organizationId: string,
      @Body() body: InviteUserDto, 
  ) {
      return this.organizationService.inviteUserToOrganization(organizationId, body);
  }
}
