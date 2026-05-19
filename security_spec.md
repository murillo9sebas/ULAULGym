# NordicLift Security Specification

## Data Invariants
1. A user can only read and write their own profile data (public and private).
2. A user can only read and write their own weight logs.
3. A user can only read and write their own workout sessions.
4. Timestamps must be valid server timestamps.
5. Weight and reps must be non-negative numbers.

## The "Dirty Dozen" Payloads

1. **Identity Spoofing (Public Profile)**: Attempt to create a public profile for another user.
2. **PII Leak (Private Info)**: Attempt to read another user's private info.
3. **Weight Hijack**: Attempt to update weight logs for another user.
4. **Session Injection**: Attempt to create a workout session for another user.
5. **State Shortcutting (Workout Date)**: Attempt to set a `lastWorkoutDate` in the future or manually (not using server timestamp).
6. **Negative Weight**: Attempt to log a negative weight.
7. **Negative Reps**: Attempt to log negative repetitions.
8. **Shadow Fields (Public Profile)**: Attempt to add an `isAdmin` field to the public profile.
9. **Orphaned Weights**: Attempt to create a weight log without a corresponding user ID in the path.
10. **Identity Integrity (Email)**: Attempt to set a different email in private info than what is in `request.auth.token`.
11. **Resource Poisoning (Exercise ID)**: Attempt to use a 1MB string as an `exerciseId`.
12. **Blanket Read (Sessions)**: Attempt to list all sessions for all users.

## The Test Runner (firestore.rules.test.ts)
*(This will be implemented if I had a test suite environment, but I'll focus on the rules first)*
