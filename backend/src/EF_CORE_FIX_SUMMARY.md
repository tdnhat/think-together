# EF Core Shadow Property Warnings - Resolution

## Problem
Entity Framework Core was generating warnings about shadow foreign key properties being created because of conflicts with existing foreign key properties in the entity classes.

### Example Warning
```
warn: Microsoft.EntityFrameworkCore.Model.Validation[10625]
      The foreign key property 'ChallengeAnswer.ChallengeAttemptId1' was created in shadow state 
      because a conflicting property with the simple name 'ChallengeAttemptId' exists in the entity type, 
      but is either not mapped, is already used for another relationship, or is incompatible with the 
      associated primary key type.
```

## Root Cause
The entity configuration files were using lambda expressions to specify foreign keys:
```csharp
builder.HasOne<ChallengeAttempt>()
    .WithMany()
    .HasForeignKey(ca => ca.ChallengeAttemptId)  // Lambda expression
    .OnDelete(DeleteBehavior.Cascade);
```

When using lambda expressions with entities that don't have navigation properties, EF Core sometimes creates shadow properties to avoid conflicts, resulting in properties like `ChallengeAttemptId1`.

## Solution
Changed all foreign key configurations to use string literals instead of lambda expressions:

```csharp
builder.HasOne<ChallengeAttempt>()
    .WithMany()
    .HasForeignKey("ChallengeAttemptId")  // String literal
    .OnDelete(DeleteBehavior.Cascade);
```

This explicitly tells EF Core to use the existing foreign key property in the entity class.

## Real-World DDD Approach: Navigation Properties vs Foreign Keys

### The DDD Principle
According to Domain-Driven Design best practices:

**✅ DO:** Reference other aggregates by their identity (ID) only  
**❌ DON'T:** Use navigation properties to navigate between different aggregate roots

### Why This Matters

1. **Aggregate Boundaries**: Each aggregate root should be a consistency boundary. Navigation properties across aggregates blur these boundaries.

2. **Coupling**: Navigation properties create tight coupling between aggregates, making it harder to maintain bounded contexts.

3. **Performance**: Navigation properties encourage lazy loading and N+1 query problems across aggregate boundaries.

### What Real-World DDD Projects Do

#### Option 1: Foreign Keys Only (Our Approach) ✅
```csharp
public class HomeworkSubmission : Entity
{
    public Guid Id { get; private set; }
    public Guid HomeworkId { get; private set; }      // FK only - no navigation
    public Guid StudentId { get; private set; }        // FK only - no navigation
    public Guid ChallengeAttemptId { get; private set; } // FK only - no navigation
}
```

**Configuration:**
```csharp
builder.HasOne<Homework>()
    .WithMany()
    .HasForeignKey("HomeworkId")  // String literal to avoid shadow properties
    .OnDelete(DeleteBehavior.Cascade);
```

**Pros:**
- Pure DDD - respects aggregate boundaries
- Forces explicit queries when you need related data
- No accidental lazy loading
- Clear bounded context separation

**Cons:**
- More verbose querying (need to manually join)
- Can't use Include() for eager loading

#### Option 2: Private Navigation Properties
```csharp
public class HomeworkSubmission : Entity
{
    public Guid Id { get; private set; }
    public Guid HomeworkId { get; private set; }
    
    // Private navigation - hidden from domain logic
    private Homework _homework;
}
```

**Configuration:**
```csharp
builder.HasOne("_homework")  // Reference private field
    .WithMany()
    .HasForeignKey(hs => hs.HomeworkId)
    .OnDelete(DeleteBehavior.Cascade);
```

**Pros:**
- Still respects DDD (not exposed to domain logic)
- Allows EF Core to track relationships properly
- Can use Include() in infrastructure layer

**Cons:**
- More complex configuration
- Temptation to expose the navigation

#### Option 3: Navigation Properties in Infrastructure Layer Only
Some projects separate domain entities from persistence entities:

```csharp
// Domain Layer
public class HomeworkSubmission
{
    public Guid HomeworkId { get; }  // Value type, no navigation
}

// Infrastructure Layer
public class HomeworkSubmissionDao
{
    public Guid HomeworkId { get; set; }
    public HomeworkDao Homework { get; set; }  // Navigation for EF
}
```

**Pros:**
- Complete separation of concerns
- Domain stays pure
- Infrastructure can optimize for persistence

**Cons:**
- Requires mapping between domain and DAO
- More code to maintain
- Increased complexity

### What We're Doing (Current Approach)

Our project uses **Option 1** - Foreign keys without navigation properties:

```csharp
// Entity
public Guid ChallengeAttemptId { get; private set; }

// Configuration
builder.HasOne<ChallengeAttempt>()
    .WithMany()
    .HasForeignKey("ChallengeAttemptId")  // String literal!
    .OnDelete(DeleteBehavior.Cascade);
```

### Why String Literals Instead of Lambda Expressions?

When you have foreign keys but NO navigation properties:

**❌ Lambda Expression:**
```csharp
.HasForeignKey(ca => ca.ChallengeAttemptId)
```
EF Core sees the lambda references a property but finds no matching navigation, so it creates a shadow property `ChallengeAttemptId1`.

**✅ String Literal:**
```csharp
.HasForeignKey("ChallengeAttemptId")
```
EF Core directly maps to the existing property without confusion.

### Expert Sources

1. **Steve "Ardalis" Smith** (Microsoft MVP):
   > "Don't use navigation properties for entities that live outside your module. Instead always just use keys."
   > [Source](https://ardalis.com/navigation-properties-between-aggregates-modules/)

2. **Microsoft EF Core Documentation**:
   > "Shadow properties are most often used for foreign key properties when there's data that shouldn't be exposed on the mapped entity types."
   > [Source](https://learn.microsoft.com/en-us/ef/core/modeling/shadow-properties)

3. **Eric Evans (DDD Creator)**:
   > "Limit associations to be single directed, for clarity and simplicity of implementation."
   > Domain-Driven Design: Tackling Complexity in the Heart of Software

### When to Use Navigation Properties

Navigation properties ARE appropriate within the same aggregate:

```csharp
public class ChallengeAttempt : Entity  // Aggregate Root
{
    private readonly List<ChallengeAnswer> _answers = new();  // Same aggregate
    public IReadOnlyList<ChallengeAnswer> Answers => _answers.AsReadOnly();
}
```

**Configuration:**
```csharp
builder.HasMany<ChallengeAnswer>()
    .WithOne()
    .HasForeignKey("ChallengeAttemptId")  // Still use string literal!
    .OnDelete(DeleteBehavior.Cascade);
```

## Files Modified
1. **ChallengeAnswerConfiguration.cs** - Fixed `ChallengeAttemptId` and `QuestionId`
2. **ChallengeAttemptConfiguration.cs** - Fixed `ChallengeId` and `UserId`
3. **ClassMemberConfiguration.cs** - Fixed `ClassId` and `UserId`
4. **HomeworkConfiguration.cs** - Fixed `ClassId`, `QuizSetId`, and `HomeworkId`
5. **HomeworkSubmissionConfiguration.cs** - Fixed `HomeworkId`, `StudentId`, and `ChallengeAttemptId`
6. **GamePlayerConfiguration.cs** - Fixed `GameSessionId`
7. **GameQuestionConfiguration.cs** - Fixed `GameSessionId` and `QuestionId`
8. **GameScoreConfiguration.cs** - Fixed `GameSessionId` and `GamePlayerId`
9. **QuestionConfiguration.cs** - Fixed `QuizSetId`
10. **UserConfiguration.cs** - Fixed `RoleId`

## Benefits
- ✅ No more shadow property warnings
- ✅ Cleaner database model
- ✅ Explicit foreign key mapping
- ✅ Better performance (no unnecessary shadow properties)
- ✅ Easier to debug relationship issues
- ✅ **Respects DDD aggregate boundaries**
- ✅ **Prevents tight coupling between aggregates**
- ✅ **Forces explicit, intentional querying**

## Verification
Run the application and check the logs - there should be no more EF Core Model.Validation warnings about shadow properties.

```bash
dotnet build  # Should build without warnings
dotnet run    # Should start without EF Core shadow property warnings
```

## Further Reading

- [EF Core Shadow Properties](https://learn.microsoft.com/en-us/ef/core/modeling/shadow-properties)
- [EF Core Relationships](https://learn.microsoft.com/en-us/ef/core/modeling/relationships)
- [Navigation Properties Between Aggregates](https://ardalis.com/navigation-properties-between-aggregates-modules/)
- [DDD and EF Core Best Practices](https://www.thereformedprogrammer.net/creating-domain-driven-design-entity-classes-with-entity-framework-core/)


