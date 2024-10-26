import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Organization } from '../models/organization.model';
import { User } from '../models/user.model';
import { CreateOrganizationDto, UpdateOrganizationDto, InviteUserDto } from './dto/organization.dto';

@Injectable()
export class OrganizationService {
  constructor(
    @InjectModel(Organization.name) private organizationModel: Model<Organization>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  // Create a new organization
  async createOrganization(createOrganizationDto: CreateOrganizationDto, userId: string) {
    const organization = new this.organizationModel({
      ...createOrganizationDto,
      members: [userId], // Add the creator as the first member
    });
    await organization.save();
    return organization; 
  }

  // Retrieve a specific organization by ID
  async getOrganizationById(organizationId: string) {
    const organization = await this.organizationModel.findById(organizationId).populate('members', 'name email accessLevel');
    if (!organization) throw new NotFoundException('Organization not found');
    return organization;
  }

  // Retrieve all organizations
  async getAllOrganizations() {
    return this.organizationModel.find().populate('members', 'name email accessLevel');
  }

  // Update an organization's details
  async updateOrganization(organizationId: string, updateOrganizationDto: UpdateOrganizationDto) {
    const organization = await this.organizationModel.findByIdAndUpdate(organizationId, updateOrganizationDto, { new: true });
    if (!organization) throw new NotFoundException('Organization not found');
    return organization;
  }

  // Delete an organization
  async deleteOrganization(organizationId: string) {
    const organization = await this.organizationModel.findByIdAndDelete(organizationId);
    if (!organization) throw new NotFoundException('Organization not found');
    return { message: 'Organization deleted successfully' };
  }


  async inviteUserToOrganization(organizationId: string, inviteUserDto: InviteUserDto) {
    // Find the organization by ID
    const organization = await this.organizationModel.findById(organizationId);
    if (!organization) throw new NotFoundException('Organization not found');

    // Find the user by email
    const user = await this.userModel.findOne({ email: inviteUserDto.user_email });
    if (!user) throw new BadRequestException('User with this email does not exist');

    // Ensure user._id is of type Types.ObjectId
    const userId: Types.ObjectId = user._id;

    // Check if the user is already a member
    if (organization.members.includes(userId)) {
      throw new BadRequestException('User is already a member of the organization');
    }

    // Add the user to the members array
    organization.members.push(userId);
    await organization.save();

    return { message: 'User invited successfully' };
  }
}