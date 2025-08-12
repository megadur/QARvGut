// ---------------------------------------
// Email: quickapp@ebenmonney.com
// Templates: www.ebenmonney.com/templates
// (c) 2024 www.ebenmonney.com/mit-license
// ---------------------------------------

export class User {
  constructor(
    public id = '',
    public userName = '',
    public fullName = '',
    public email = '',
    public jobTitle = '',
    public phoneNumber = '',
    roles: string[] = []
  ) {
    if (roles)
      this.roles = roles;
  }

  get friendlyName() {
    let name = this.fullName || this.userName;

    if (this.jobTitle) {
      name = this.jobTitle + ' ' + name;
    }

    return name;
  }

  public isEnabled = true;
  public isLockedOut = false;
  public roles: string[] = [];

  // Extended fields from Story 1.1 - Business Object Aligned
  public department?: string | null = null;
  public phone?: string | null = null;
  public contactInfo?: string | null = null;
  public preferences?: string | null = null; // JSON field
  public lastLoginDate?: string | null = null; // ISO date string
  public lastLoginIp?: string | null = null;
  public loginCount = 0;
  public isActive = true;
  public gesperrtSeit?: string | null = null; // ISO date string
  public avatar?: string | null = null;

  // Convenience getters for registration form fields
  public get firstName(): string {
    const parts = this.fullName?.split(' ') || [];
    return parts[0] || '';
  }

  public set firstName(value: string) {
    const lastName = this.lastName;
    this.fullName = lastName ? `${value} ${lastName}` : value;
  }

  public get lastName(): string {
    const parts = this.fullName?.split(' ') || [];
    return parts.slice(1).join(' ') || '';
  }

  public set lastName(value: string) {
    const firstName = this.firstName;
    this.fullName = firstName ? `${firstName} ${value}` : value;
  }
}
