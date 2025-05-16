# Git Survival Guide for Developers

## Introduction

Git is an essential tool for developers, allowing for efficient version control and collaboration. This guide covers key commands and workflows that will help you navigate common scenarios in Git.

## 🔥 The Life-Saving Stash Flow

_(When you need to context-switch fast)_

### Commands Explained:

1. **Save everything (including untracked files)**:
   ```bash
   git stash push -u -m "WIP: auth middleware"
   This command saves your changes and untracked files to a stash, allowing you to switch contexts without losing your work.
   ```

Verify stash saved:
bash

Copy
git stash list
Lists all stashed changes, confirming that your work has been saved.
Create a new branch for your changes (optional):
bash

Copy
git checkout -b experiment/auth-refactor
Creates and switches to a new branch for experimenting with changes.
Restore changes:
bash

Copy
git stash pop
Restores the most recent stash and removes it from the stash list.
Return to a clean state:
bash

Copy
git checkout main
git reset --hard HEAD
Switches back to the main branch and resets it to the last commit. Warning: This destroys any uncommitted changes.
Pro Tip:
Use git stash -p to selectively stash chunks of changes.

🧹 Clean Working Directory Flow
(When everything's broken)

Commands Explained:
Reset to last commit (DESTRUCTIVE!):
bash

Copy
git reset --hard HEAD
Resets your working directory to the last commit, discarding all changes.
Clean untracked files (DANGER ZONE):
bash

Copy
git clean -fd
Removes untracked files and directories. Use with caution!
Safe alternative: stash everything:
bash

Copy
git stash push -m "nuclear option"
Stashes all changes as a backup before making drastic changes.
⏪ Undo Almost Anything
Mistake Fix
Bad commit git reset --soft HEAD~1
Pushed bad commit git revert <hash>
Wrong branch commit git stash && git checkout correct-branch && git stash pop
Messed up merge git merge --abort
🔀 Branching Like a Pro
Commands Explained:
Create branch from specific commit:
bash

Copy
git branch fix/leaks abcd123
Creates a new branch from a specific commit hash.
Sync branch with main:
bash

Copy
git checkout feat/awesome
git rebase main
Updates your feature branch with the latest changes from the main branch.
Delete merged branches:
bash

Copy
git branch --merged | grep -v "main" | xargs git branch -d
Deletes branches that have been merged, excluding the main branch.
🕵️‍♂️ Forensic Git
Commands Explained:
Find dead code:
bash

Copy
git log -S "deleted_function" --all
Searches for commits that added or removed a specific string.
See who changed a line:
bash

Copy
git blame -L 15,20 src/lib.rs
Displays the commit history for specific lines in a file.
Visualize history:
bash

Copy
git log --graph --oneline --all
Shows a visual representation of the commit history.
🛠️ Must-Have Aliases (~/.gitconfig)
ini

Copy
[alias]
lol = log --graph --oneline --all
st = status -sb
undo = reset HEAD~1 --soft
fixup = commit --fixup HEAD
recent = branch --sort=-committerdate
These aliases streamline your workflow and make command entry quicker.

🚨 Emergency Cheatsheet
Commands Explained:
Recover deleted branch:
bash

Copy
git reflog | grep "lost-branch"
git checkout -b lost-branch abcd123
Retrieves a deleted branch using the reflog.
Undo last push (force push):
bash

Copy
git reset HEAD~1
git push -f
Resets the last commit and force pushes the changes. Warning: Force pushes rewrite history. Avoid using this on shared branches!
🏆 Pro Workflow
Code: Make small changes.
Stage:
bash

Copy
git add -p
Commit:
bash

Copy
git commit -m "feat(scope): concise message"
Polish:
bash

Copy
git rebase -i --autosquash main
Share:
bash

Copy
git push -u origin feat/awesome
Conclusion
This Git Survival Guide provides essential commands and workflows to help you manage your projects effectively. Keep this guide handy for quick reference in your development journey!
