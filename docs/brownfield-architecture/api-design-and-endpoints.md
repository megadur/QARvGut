# API Design and Endpoints

### Enhanced User Management API Endpoints

**Bulk Operations:**
- `POST /api/account/users/bulk-import` - Import users from CSV/JSON
- `POST /api/account/users/bulk-roles` - Bulk role assignment
- `POST /api/account/users/bulk-activate` - Bulk activation/deactivation
- `GET /api/account/users/export` - Export users with filtering

**Advanced Search and Filtering:**
- `GET /api/account/users/search?department={}&role={}&status={}&page={}` - Advanced search
- `GET /api/account/users/activity?fromDate={}&toDate={}` - Activity reports

**Profile Management:**
- `PUT /api/account/users/{id}/profile` - Update extended profile
- `GET /api/account/users/{id}/activity` - User activity history

All endpoints follow existing patterns:
- Authorization via `[Authorize(AuthPolicies.ViewAllUsersPolicy)]` and similar
- Response format consistent with existing UserVM patterns
- Error handling following current controller conventions
