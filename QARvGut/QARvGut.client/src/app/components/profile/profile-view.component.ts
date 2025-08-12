// ---------------------------------------
// Story 1.2 Task 3: Profile View Component
// Enterprise profile display with activity tracking
// ---------------------------------------

import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { Subject } from 'rxjs';

import { AuthService } from '../../services/auth.service';
import { AccountService } from '../../services/account.service';
import { AlertService, MessageSeverity } from '../../services/alert.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-profile-view',
  templateUrl: './profile-view.component.html',
  styleUrl: './profile-view.component.scss',
  imports: [CommonModule, RouterModule]
})
export class ProfileViewComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();

  // Service injections
  private readonly authService = inject(AuthService);
  private readonly accountService = inject(AccountService);
  private readonly alertService = inject(AlertService);
  private readonly router = inject(Router);

  // Component state
  currentUser: User | null = null;
  userActivity: Record<string, unknown> | null = null;
  isLoading = false;
  lastLoginFormatted = '';
  accountAgeFormatted = '';

  ngOnInit(): void {
    this.loadUserProfile();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Load current user profile and activity data
   */
  private loadUserProfile(): void {
    this.isLoading = true;
    this.currentUser = this.authService.currentUser;

    if (!this.currentUser) {
      this.alertService.showMessage(
        'Authentication Error',
        'Please log in to view your profile',
        MessageSeverity.error
      );
      this.router.navigate(['/login']);
      return;
    }

    // Format display dates
    this.formatDisplayDates();
    this.isLoading = false;
  }

  /**
   * Format dates for display
   */
  private formatDisplayDates(): void {
    if (this.currentUser?.lastLoginDate) {
      const lastLogin = new Date(this.currentUser.lastLoginDate);
      this.lastLoginFormatted = this.formatRelativeDate(lastLogin);
    }

    // Calculate account age (using current date as creation date is not available)
    // This could be enhanced when creation date is added to the User model
    this.accountAgeFormatted = 'Recently created';
  }

  /**
   * Format relative date (e.g., "2 days ago")
   */
  private formatRelativeDate(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffMs / (1000 * 60));

    if (diffDays > 0) {
      return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`;
    } else if (diffHours > 0) {
      return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`;
    } else if (diffMinutes > 0) {
      return `${diffMinutes} minute${diffMinutes === 1 ? '' : 's'} ago`;
    } else {
      return 'Just now';
    }
  }

  /**
   * Navigate to profile edit
   */
  editProfile(): void {
    this.router.navigate(['/profile/edit']);
  }

  /**
   * Navigate to password change
   */
  changePassword(): void {
    this.router.navigate(['/profile/change-password']);
  }

  /**
   * Navigate to preferences
   */
  managePreferences(): void {
    this.router.navigate(['/profile/preferences']);
  }

  /**
   * Get user's roles as formatted string
   */
  getRolesDisplay(): string {
    return this.currentUser?.roles?.join(', ') || 'No roles assigned';
  }

  /**
   * Get user status display
   */
  getUserStatus(): string {
    if (!this.currentUser) return 'Unknown';

    if (!this.currentUser.isActive) return 'Inactive';
    if (this.currentUser.isLockedOut) return 'Locked Out';
    if (!this.currentUser.isEnabled) return 'Disabled';

    return 'Active';
  }

  /**
   * Get user status CSS class
   */
  getUserStatusClass(): string {
    const status = this.getUserStatus();
    switch (status) {
      case 'Active': return 'status-active';
      case 'Inactive': return 'status-inactive';
      case 'Locked Out': return 'status-locked';
      case 'Disabled': return 'status-disabled';
      default: return 'status-unknown';
    }
  }

  /**
   * Get parsed preferences object
   */
  getParsedPreferences(): Record<string, unknown> {
    if (!this.currentUser?.preferences) return {};

    try {
      return JSON.parse(this.currentUser.preferences);
    } catch {
      return {};
    }
  }

  /**
   * Check if user has avatar
   */
  hasAvatar(): boolean {
    return !!(this.currentUser?.avatar);
  }

  /**
   * Get avatar URL or default
   */
  getAvatarUrl(): string {
    return this.currentUser?.avatar || '/assets/images/default-avatar.png';
  }

  /**
   * Handle avatar error (fallback to default)
   */
  onAvatarError(event: Event): void {
    const target = event.target as HTMLImageElement;
    if (target) {
      target.src = '/assets/images/default-avatar.png';
    }
  }

  /**
   * Get login count display
   */
  getLoginCountDisplay(): string {
    const count = this.currentUser?.loginCount || 0;
    return `${count} login${count === 1 ? '' : 's'}`;
  }
}
