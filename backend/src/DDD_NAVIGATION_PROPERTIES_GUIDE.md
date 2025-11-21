# DDD Navigation Properties: A Quick Reference

## The Question
**Should DDD entities use navigation properties to reference other aggregates?**

## TL;DR Answer
**NO** - Real-world DDD projects avoid navigation properties between different aggregate roots.

## Quick Comparison

### ❌ Violates DDD (Tight Coupling)
```csharp
public class HomeworkSubmission : Entity
{
    public Guid HomeworkId { get; private set; }
    public Homework Homework { get; set; }  // ❌ Navigation to another aggregate
    
    public Guid StudentId { get; private set; }
    public User Student { get; set; }  // ❌ Navigation to another aggregate
}
```

### ✅ Follows DDD (Loose Coupling)
```csharp
public class HomeworkSubmission : Entity
{
    public Guid HomeworkId { get; private set; }  // ✅ ID reference only
    public Guid StudentId { get; private set; }    // ✅ ID reference only
    
    // No navigation properties to other aggregates
}
```

### ✅ Navigation WITHIN Same Aggregate (OK)
```csharp
public class ChallengeAttempt : AggregateRoot
{
    private readonly List<ChallengeAnswer> _answers = new();
    
    // ✅ OK - ChallengeAnswer is part of this aggregate
    public IReadOnlyList<ChallengeAnswer> Answers => _answers.AsReadOnly();
}
```

## Why This Matters

### With Navigation Properties (❌)
```csharp
// Tempting but violates aggregate boundaries
var submission = await context.HomeworkSubmissions
    .Include(s => s.Homework)       // Loads entire Homework aggregate
    .Include(s => s.Student)         // Loads entire User aggregate
    .FirstAsync(s => s.Id == id);

// Now you can accidentally modify other aggregates
submission.Homework.Title = "Changed!";  // ❌ Violates Homework aggregate boundary
```

### With IDs Only (✅)
```csharp
// Explicit, intentional loading
var submission = await context.HomeworkSubmissions
    .FirstAsync(s => s.Id == id);

// Want homework details? Explicit query through repository
var homework = await homeworkRepository.GetByIdAsync(submission.HomeworkId);

// Want to modify homework? Go through its aggregate root
await homework.UpdateTitle("New Title");  // ✅ Proper aggregate method
```

## The Three Approaches

### 1. Foreign Keys Only (Pure DDD) ⭐ Our Approach
```csharp
// Entity
public Guid ClassId { get; private set; }

// Configuration - Use STRING LITERAL
builder.HasOne<Class>()
    .WithMany()
    .HasForeignKey("ClassId")  // ✅ String literal prevents shadow properties
    .OnDelete(DeleteBehavior.Cascade);
```

### 2. Private Navigation Properties (Compromise)
```csharp
// Entity
public Guid ClassId { get; private set; }
private Class _class;  // Private, not exposed to domain

// Configuration
builder.HasOne("_class")
    .WithMany()
    .HasForeignKey(e => e.ClassId);
```

### 3. Separate Domain/Infrastructure Entities (Complex)
```csharp
// Domain
public class HomeworkSubmission { 
    public Guid HomeworkId { get; } 
}

// Infrastructure
public class HomeworkSubmissionDao { 
    public Homework Homework { get; set; } 
}
```

## EF Core Configuration: Lambda vs String

### ❌ Lambda Expression (Creates Shadow Properties)
```csharp
builder.HasOne<ChallengeAttempt>()
    .WithMany()
    .HasForeignKey(ca => ca.ChallengeAttemptId)  // ❌ Creates ChallengeAttemptId1
    .OnDelete(DeleteBehavior.Cascade);
```

### ✅ String Literal (Uses Existing Property)
```csharp
builder.HasOne<ChallengeAttempt>()
    .WithMany()
    .HasForeignKey("ChallengeAttemptId")  // ✅ Uses existing property
    .OnDelete(DeleteBehavior.Cascade);
```

## Rule of Thumb

```
┌─────────────────────────────────────────────────┐
│  Same Aggregate?                                │
├─────────────────────────────────────────────────┤
│  ✅ YES → Navigation properties OK              │
│     Example: ChallengeAttempt.Answers           │
│                                                 │
│  ❌ NO → Use IDs only                           │
│     Example: HomeworkSubmission.HomeworkId      │
└─────────────────────────────────────────────────┘
```

## Expert Quotes

**Steve Smith (Ardalis):**
> "Don't use navigation properties for entities that live outside your module."

**Eric Evans:**
> "Limit associations to be single directed, for clarity and simplicity."

**Microsoft EF Core Docs:**
> "Shadow properties are useful when there's data that shouldn't be exposed on the mapped entity types."

## Summary

✅ **DO:**
- Use foreign key properties (IDs) to reference other aggregates
- Use navigation properties WITHIN the same aggregate
- Query related aggregates explicitly when needed
- Use string literals in HasForeignKey() to avoid shadow properties

❌ **DON'T:**
- Add navigation properties between different aggregates
- Use Include() to load other aggregates
- Modify other aggregates through navigation properties
- Use lambda expressions in HasForeignKey() when there's no navigation property

