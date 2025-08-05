# NuGet Configuration Setup

## ⚠️ Important Security Notice

The `nuget.config` file has been removed from version control because it contains sensitive credentials.

## Setup Instructions

1. **Copy the template:**
   ```cmd
   copy nuget.config.template nuget.config
   ```

2. **Add your credentials:**
   Edit `nuget.config` and replace:
   - `YOUR_USERNAME_HERE` with your Azure DevOps email
   - `YOUR_PERSONAL_ACCESS_TOKEN_HERE` with your Azure DevOps Personal Access Token

3. **Verify the file is ignored:**
   ```cmd
   git status
   ```
   The `nuget.config` should NOT appear in git status.

## Azure DevOps Personal Access Token

To create a Personal Access Token:
1. Go to Azure DevOps → User Settings → Personal Access Tokens
2. Create new token with **Packaging (read)** permissions
3. Copy the token value and use it in `nuget.config`

## Security

- ✅ `nuget.config` is in `.gitignore`
- ✅ Never commit credentials to version control
- ✅ Use Personal Access Tokens, not passwords
- ✅ Rotate tokens regularly
