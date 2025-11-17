# GitHub Workflow - Pushing Changes

This guide describes how to push your local changes to the GitHub repository as a backup and version control.

## Repository Information

- **Repository URL**: https://github.com/Kornform/recepie-gallery-nextjs
- **Default Branch**: master

## Quick Reference - Push Changes to GitHub

```bash
# 1. Check what files have changed
git status

# 2. Stage all changes
git add .

# 3. Commit with a descriptive message
git commit -m "Your descriptive commit message here"

# 4. Push to GitHub
git push origin master
```

## Detailed Step-by-Step Guide

### Step 1: Check Current Status

Before making any changes, see what files have been modified:

```bash
git status
```

This shows:
- Modified files (red)
- Staged files (green)
- Untracked files (new files not yet in git)

### Step 2: Stage Your Changes

#### Stage All Changes
```bash
git add .
```

#### Stage Specific Files
```bash
git add path/to/file.tsx
git add app/src/components/recipe-card.tsx
```

#### Stage Multiple Specific Files
```bash
git add file1.tsx file2.tsx file3.css
```

#### Stage All Files of a Certain Type
```bash
git add *.tsx          # All TypeScript React files
git add app/src/**/*.tsx  # All .tsx files in app/src and subdirectories
```

### Step 3: Commit Your Changes

Create a commit with a descriptive message:

```bash
git commit -m "Add new recipe filtering feature"
```

#### Good Commit Message Examples:
- `"Fix recipe card image display issue"`
- `"Add search functionality to recipe gallery"`
- `"Update design tokens for dark mode"`
- `"Refactor recipe data structure"`
- `"Update DEPLOY.md with new instructions"`

#### Bad Commit Message Examples:
- `"fixes"` (too vague)
- `"update"` (what was updated?)
- `"asdf"` (not descriptive)
- `"some changes"` (what changes?)

### Step 4: Push to GitHub

Push your commits to the remote repository:

```bash
git push origin master
```

If you're on a different branch:
```bash
git push origin branch-name
```

## Common Workflows

### Daily Backup Workflow

```bash
# At the end of your work session
git status                              # See what changed
git add .                               # Stage everything
git commit -m "End of day: [brief description of what you worked on]"
git push origin master                  # Push to GitHub
```

### Feature Development Workflow

```bash
# After completing a feature
git status                              # Review changes
git add .                               # Stage all changes
git commit -m "Add [feature name]: [brief description]"
git push origin master                  # Push to GitHub
```

### Before Taking a Break Workflow

```bash
# Quick save before lunch/break
git add .
git commit -m "WIP: [what you're working on]"
git push origin master
```

Note: "WIP" means "Work In Progress"

## Checking Your Push History

View your recent commits:

```bash
# See last 5 commits
git log -5

# See compact one-line version
git log --oneline -10

# See what was changed in last commit
git show
```

## Pulling Changes from GitHub

If you work from multiple computers or collaborate with others:

```bash
# Get latest changes from GitHub
git pull origin master
```

Always pull before starting work if you use multiple machines!

## Handling Common Issues

### Issue: "Nothing to commit, working tree clean"

This means there are no changes to push. All your files match what's on GitHub.

```bash
git status  # Verify no changes
```

### Issue: "Your branch is ahead of 'origin/master' by X commits"

You have local commits that aren't on GitHub yet. Push them:

```bash
git push origin master
```

### Issue: "Your branch is behind 'origin/master'"

GitHub has changes you don't have locally. Pull them first:

```bash
git pull origin master
```

### Issue: Merge Conflicts

If you get a merge conflict after pulling:

1. Open the conflicted files (git will mark them)
2. Look for conflict markers: `<<<<<<<`, `=======`, `>>>>>>>`
3. Edit the file to resolve conflicts
4. Stage the resolved files: `git add filename`
5. Commit: `git commit -m "Resolve merge conflict"`
6. Push: `git push origin master`

### Issue: Forgot to Add a File

If you committed but forgot to add a file:

```bash
git add forgotten-file.tsx
git commit --amend --no-edit
git push origin master --force-with-lease
```

**Warning**: Only use `--force-with-lease` if you haven't pushed yet or you're sure no one else has pulled your commits.

### Issue: Want to Undo Last Commit (Before Push)

```bash
# Undo commit but keep changes
git reset --soft HEAD~1

# Undo commit and discard changes (CAREFUL!)
git reset --hard HEAD~1
```

## Best Practices

### 1. Commit Often
- Don't wait until the end of the day
- Commit after completing each logical piece of work
- Small, focused commits are better than large ones

### 2. Write Good Commit Messages
- Start with a verb: "Add", "Fix", "Update", "Remove", "Refactor"
- Be specific about what changed
- Keep the first line under 50 characters
- Add details in the body if needed

### 3. Push Regularly
- Push at least once per work session
- Push after completing features
- Push before switching computers

### 4. Check Status Before Committing
```bash
git status  # Always check what you're committing
git diff    # Review actual changes
```

### 5. Use .gitignore Properly
The `.gitignore` file prevents certain files from being tracked:

```
# Already configured in app/.gitignore
node_modules/
.next/
.env.local
.DS_Store
```

Never commit:
- `node_modules/` (dependencies)
- `.env.local` (secrets)
- `.next/` (build output)
- Personal IDE settings

## Quick Command Reference

| Command | Description |
|---------|-------------|
| `git status` | Show changed files |
| `git add .` | Stage all changes |
| `git add <file>` | Stage specific file |
| `git commit -m "message"` | Commit staged changes |
| `git push origin master` | Push to GitHub |
| `git pull origin master` | Get latest from GitHub |
| `git log` | View commit history |
| `git diff` | See unstaged changes |
| `git diff --staged` | See staged changes |
| `git reset HEAD <file>` | Unstage a file |
| `git checkout -- <file>` | Discard changes in file |
| `git branch` | List branches |
| `git remote -v` | Show remote URL |

## Visual Workflow Diagram

```
Working Directory → Staging Area → Local Repository → GitHub
                 git add        git commit        git push

[Your Files] → [git add .] → [Staged] → [git commit] → [Local Git] → [git push] → [GitHub]
```

## Setting Up Git Aliases (Optional)

Make commands shorter by adding aliases to your git config:

```bash
# Set up useful aliases
git config --global alias.st status
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.cm commit
git config --global alias.ps push

# Now you can use:
git st   # instead of git status
git cm -m "message"  # instead of git commit -m "message"
git ps origin master # instead of git push origin master
```

## Emergency: "I Messed Up Everything!"

If you really messed up and want to reset to what's on GitHub:

```bash
# WARNING: This discards ALL local changes!
git fetch origin
git reset --hard origin/master
```

**Only use this if you're absolutely sure you want to lose all local changes!**

## Getting Help

```bash
# Get help for any command
git help <command>
git help commit
git help push

# Quick help
git <command> --help
git push --help
```

## Summary

The most common workflow you'll use daily:

```bash
git status                    # Check what changed
git add .                     # Stage changes
git commit -m "Descriptive message"  # Commit
git push origin master        # Push to GitHub (backup!)
```

That's it! These four commands will handle 90% of your GitHub workflow needs.
