// ---------------------------------------
// Story 1.2 Task 3: Profile Activity Component
// User activity tracking and history display
// ---------------------------------------

import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';

import { AuthService } from '../../services/auth.service';
import { AccountService } from '../../services/account.service';
import { AlertService, MessageSeverity } from '../../services/alert.service';
import { User } from '../../models/user.model';

export interface UserActivity {
  id: string;
  type: 'login' | 'profile_update' | 'password_change' | 'logout' | 'security_event';
  description: string;
  timestamp: string;
  ipAddress?: string;
  userAgent?: string;
  success: boolean;
  details?: Record<string, unknown>;
}

@Component({
  selector: 'app-profile-activity',
  templateUrl: './profile-activity.component.html',
  styleUrl: './profile-activity.component.scss',
  imports: [CommonModule, RouterModule, FormsModule]
})
export class ProfileActivityComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();

  // Service injections
  private readonly authService = inject(AuthService);
  private readonly accountService = inject(AccountService);
  private readonly alertService = inject(AlertService);

  // Component state
  currentUser: User | null = null;
  activities: UserActivity[] = [];
  isLoading = true;
  hasError = false;
  errorMessage = '';

  // Pagination
  currentPage = 1;
  pageSize = 10;
  totalActivities = 0;

  // Filtering
  selectedActivityType = 'all';
  dateFilter: 'all' | '7days' | '30days' | '90days' = '30days';

  ngOnInit(): void {
    this.currentUser = this.authService.currentUser;

    if (!this.currentUser) {
      this.alertService.showMessage(
        'Authentication Error',
        'Please log in to view your activity',
        MessageSeverity.error
      );
      return;
    }

    this.loadUserActivity();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Load user activity data
   */
  private loadUserActivity(): void {
    this.isLoading = true;
    this.hasError = false;

    // Since we don't have a dedicated activity endpoint yet,
    // we'll create mock data based on the current user
    this.generateMockActivityData();

    // TODO: Replace with actual API call when activity tracking is implemented
    // this.accountService.getUserActivity(this.currentUser!.id, {
    //   page: this.currentPage,
    //   pageSize: this.pageSize,
    //   type: this.selectedActivityType,
    //   dateFilter: this.dateFilter
    // }).pipe(takeUntil(this.destroy$))
    //   .subscribe({
    //     next: (response) => {
    //       this.activities = response.activities;
    //       this.totalActivities = response.total;
    //       this.isLoading = false;
    //     },
    //     error: (error) => {
    //       this.handleError(error);
    //     }
    //   });
  }

  /**
   * Generate mock activity data for demonstration
   */
  private generateMockActivityData(): void {
    const now = new Date();
    const mockActivities: UserActivity[] = [];

    // Recent login
    if (this.currentUser?.lastLoginDate) {
      mockActivities.push({
        id: '1',
        type: 'login',
        description: 'Successfully logged in',
        timestamp: this.currentUser.lastLoginDate,
        ipAddress: this.currentUser.lastLoginIp || '192.168.1.100',
        success: true,
        details: {
          method: 'password',
          browser: 'Chrome 119.0',
          os: 'Windows 11'
        }
      });
    }

    // Profile updates (mock)
    mockActivities.push({
      id: '2',
      type: 'profile_update',
      description: 'Profile information updated',
      timestamp: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      success: true,
      details: {
        fields_updated: ['firstName', 'lastName', 'phoneNumber']
      }
    });

    // Password change attempt (mock)
    mockActivities.push({
      id: '3',
      type: 'password_change',
      description: 'Password successfully changed',
      timestamp: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      ipAddress: '192.168.1.100',
      success: true
    });

    // Failed login attempt (mock)
    mockActivities.push({
      id: '4',
      type: 'login',
      description: 'Failed login attempt - incorrect password',
      timestamp: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      ipAddress: '203.0.113.42',
      success: false,
      details: {
        reason: 'invalid_credentials',
        browser: 'Unknown',
        flagged: true
      }
    });

    // Previous successful login
    mockActivities.push({
      id: '5',
      type: 'login',
      description: 'Successfully logged in',
      timestamp: new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      ipAddress: '192.168.1.100',
      success: true,
      details: {
        method: 'password',
        browser: 'Chrome 118.0',
        os: 'Windows 11'
      }
    });

    // Logout
    mockActivities.push({
      id: '6',
      type: 'logout',
      description: 'User logged out',
      timestamp: new Date(now.getTime() - 16 * 24 * 60 * 60 * 1000).toISOString(),
      success: true
    });

    this.activities = mockActivities.filter(activity => this.matchesFilters(activity));
    this.totalActivities = this.activities.length;
    this.isLoading = false;
  }

  /**
   * Check if activity matches current filters
   */
  private matchesFilters(activity: UserActivity): boolean {
    // Type filter
    if (this.selectedActivityType !== 'all' && activity.type !== this.selectedActivityType) {
      return false;
    }

    // Date filter
    const activityDate = new Date(activity.timestamp);
    const now = new Date();
    const daysDiff = Math.floor((now.getTime() - activityDate.getTime()) / (1000 * 60 * 60 * 24));

    switch (this.dateFilter) {
      case '7days':
        return daysDiff <= 7;
      case '30days':
        return daysDiff <= 30;
      case '90days':
        return daysDiff <= 90;
      default:
        return true;
    }
  }

  /**
   * Handle filter changes
   */
  onFilterChange(): void {
    this.currentPage = 1;
    this.loadUserActivity();
  }

  /**
   * Handle pagination
   */
  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadUserActivity();
  }

  /**
   * Refresh activity data
   */
  refreshActivity(): void {
    this.loadUserActivity();
  }

  /**
   * Handle errors
   */
  private handleError(): void {
    this.isLoading = false;
    this.hasError = true;
    this.errorMessage = 'Unable to load activity data. Please try again.';

    this.alertService.showMessage(
      'Load Error',
      'Unable to load activity data',
      MessageSeverity.error
    );
  }

  /**
   * Get activity type icon
   */
  getActivityIcon(type: string): string {
    switch (type) {
      case 'login':
        return 'fas fa-sign-in-alt';
      case 'logout':
        return 'fas fa-sign-out-alt';
      case 'profile_update':
        return 'fas fa-user-edit';
      case 'password_change':
        return 'fas fa-key';
      case 'security_event':
        return 'fas fa-shield-alt';
      default:
        return 'fas fa-info-circle';
    }
  }

  /**
   * Get activity type badge class
   */
  getActivityBadgeClass(type: string, success: boolean): string {
    if (!success) {
      return 'badge bg-danger';
    }

    switch (type) {
      case 'login':
        return 'badge bg-success';
      case 'logout':
        return 'badge bg-secondary';
      case 'profile_update':
        return 'badge bg-info';
      case 'password_change':
        return 'badge bg-warning text-dark';
      case 'security_event':
        return 'badge bg-danger';
      default:
        return 'badge bg-primary';
    }
  }

  /**
   * Format activity timestamp
   */
  formatTimestamp(timestamp: string): string {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return 'Today at ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays === 1) {
      return 'Yesterday at ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString() + ' at ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
  }

  /**
   * Get formatted activity type name
   */
  getActivityTypeName(type: string): string {
    switch (type) {
      case 'login':
        return 'Login';
      case 'logout':
        return 'Logout';
      case 'profile_update':
        return 'Profile Update';
      case 'password_change':
        return 'Password Change';
      case 'security_event':
        return 'Security Event';
      default:
        return 'Activity';
    }
  }

  /**
   * Get risk level for activity
   */
  getRiskLevel(activity: UserActivity): 'low' | 'medium' | 'high' {
    if (!activity.success) {
      return 'high';
    }

    if (activity.type === 'security_event' || (activity.details && activity.details['flagged'])) {
      return 'high';
    }

    if (activity.type === 'password_change' || activity.type === 'profile_update') {
      return 'medium';
    }

    return 'low';
  }

  /**
   * Get total pages for pagination
   */
  getTotalPages(): number {
    return Math.ceil(this.totalActivities / this.pageSize);
  }

  /**
   * Get successful login count
   */
  getSuccessfulLoginsCount(): number {
    return this.activities.filter(a => a.type === 'login' && a.success).length;
  }

  /**
   * Get failed login count
   */
  getFailedLoginsCount(): number {
    return this.activities.filter(a => a.type === 'login' && !a.success).length;
  }

  /**
   * Get password changes count
   */
  getPasswordChangesCount(): number {
    return this.activities.filter(a => a.type === 'password_change').length;
  }

  /**
   * Get profile updates count
   */
  getProfileUpdatesCount(): number {
    return this.activities.filter(a => a.type === 'profile_update').length;
  }

  /**
   * Get browser info safely
   */
  getBrowserInfo(activity: UserActivity): string {
    return activity.details?.['browser']?.toString() || 'Unknown';
  }

  /**
   * Get updated fields as string
   */
  getUpdatedFields(activity: UserActivity): string {
    const fields = activity.details?.['fields_updated'];
    if (Array.isArray(fields)) {
      return fields.join(', ');
    }
    return 'Unknown fields';
  }

  /**
   * Get failure reason safely
   */
  getFailureReason(activity: UserActivity): string {
    return activity.details?.['reason']?.toString() || 'Unknown reason';
  }

  /**
   * Get OS info safely
   */
  getOSInfo(activity: UserActivity): string {
    return activity.details?.['os']?.toString() || 'Unknown';
  }
}
