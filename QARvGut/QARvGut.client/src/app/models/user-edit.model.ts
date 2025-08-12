// ---------------------------------------
// Email: quickapp@ebenmonney.com
// Templates: www.ebenmonney.com/templates
// (c) 2024 www.ebenmonney.com/mit-license
// ---------------------------------------

import { User } from './user.model';

export class UserEdit extends User {
  constructor(
    public currentPassword?: string,
    public newPassword?: string,
    public confirmPassword?: string) {
    super();
  }

  // Convert to registration payload
  public toRegistrationPayload(): UserRegistration {
    return {
      userName: this.userName,
      email: this.email,
      password: this.newPassword || '',
      confirmPassword: this.confirmPassword || '',
      fullName: this.fullName,
      jobTitle: this.jobTitle,
      phoneNumber: this.phoneNumber,
      department: this.department,
      phone: this.phone,
      contactInfo: this.contactInfo,
      roles: this.roles
    };
  }
}

// Registration-specific interface for API calls
export interface UserRegistration {
  userName: string;
  email: string;
  password: string;
  confirmPassword: string;
  fullName: string;
  jobTitle?: string;
  phoneNumber?: string;
  department?: string | null;
  phone?: string | null;
  contactInfo?: string | null;
  roles: string[];
}
