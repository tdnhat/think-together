# Entity Mapping Reference
# Tài Liệu Tham Chiếu Ánh Xạ Thực Thể

**Version:** 1.0  
**Date:** October 17, 2025  
**Purpose:** English ↔ Vietnamese entity and property mapping guide

---

## 1. ENTITY MAPPING (C# Class ↔ Database Table)

| C# Class Name | Vietnamese Table Name | Description |
|---|---|---|
| User | NguoiDung | User accounts |
| Role | VaiTro | User roles |
| QuizSet | BoTrucNghiem | Quiz/Test sets |
| Question | CauHoi | Questions |
| QuestionType | LoaiCauHoi | Question types |
| Answer | PhuongAn | Answer options |
| MatchPair | CapGhep | Matching pairs |
| OrderItem | MucSapXep | Ordering items |
| MediaFile | TepTapTin | Media files |
| GameSession | PhienChoi | Live game sessions |
| GameSessionSettings | CaiDatPhienChoi | Game session settings |
| SessionQuestion | CauHoiTrongPhien | Question in session |
| Player | NguoiChoi | Game players |
| PlayerAnswer | TraLoiCauHoi | Player answers |
| PlayerScore | DiemSo | Player scores |
| QuestionStatistics | ThongKeQuestion | Question stats |
| LeaderBoard | BangXepHang | Leaderboard |
| Challenge | ThachThuc | Challenges |
| ChallengeSession | PhienThachThuc | Challenge sessions |
| ChallengeAnswer | TraLoiThachThuc | Challenge answers |
| ChallengeLeaderBoard | BangXepHangThachThuc | Challenge leaderboard |
| AuditLog | NhatKyKiemTra | Audit logs |
| AdminLog | NhatKyQuanTri | Admin logs |
| ContentFilter | BoLocTuNgoNghat | Content filter words |

---

## 2. PROPERTY MAPPING (C# Property ↔ Database Column)

### User (NguoiDung)

| C# Property | Vietnamese Column | Type | Notes |
|---|---|---|---|
| Id | idNguoiDung | int | PK |
| Email | email | nvarchar(255) | UNIQUE |
| PasswordHash | matKhau | nvarchar(255) | Hashed |
| FirstName | tenDem | nvarchar(100) | |
| LastName | tenGoi | nvarchar(100) | |
| Role | vaiTro | varchar(20) | ENUM: GIAOVIEN, QUANTRI |
| AvatarUrl | urlAnhDaiDien | nvarchar(500) | Nullable |
| Bio | gioiThieu | nvarchar(max) | Nullable |
| CreatedAt | thoiGianTao | datetime2 | DEFAULT GETUTCDATE() |
| UpdatedAt | thoiGianCapNhat | datetime2 | DEFAULT GETUTCDATE() |
| DeletedAt | thoiGianXoa | datetime2 | Nullable (Soft Delete) |

### QuizSet (BoTrucNghiem)

| C# Property | Vietnamese Column | Type | Notes |
|---|---|---|---|
| Id | idBoTrucNghiem | int | PK |
| UserId | idNguoiDung | int | FK |
| Title | tenBoTrucNghiem | nvarchar(255) | Unique per user |
| Description | moTa | nvarchar(max) | Nullable |
| CoverImageUrl | urlAnhBia | nvarchar(500) | Nullable |
| QuestionCount | soCauHoi | int | Denormalized |
| CreatedAt | thoiGianTao | datetime2 | |
| UpdatedAt | thoiGianCapNhat | datetime2 | |
| DeletedAt | thoiGianXoa | datetime2 | Soft Delete |

### Question (CauHoi)

| C# Property | Vietnamese Column | Type | Notes |
|---|---|---|---|
| Id | idCauHoi | int | PK |
| QuizSetId | idBoTrucNghiem | int | FK |
| QuestionType | loaiCauHoi | varchar(50) | FK to LoaiCauHoi |
| Content | noiDung | nvarchar(max) | |
| MediaUrl | urlMedia | nvarchar(500) | Nullable |
| TimeLimit | thoiGianGioiHan_Giay | int | 1-300 seconds |
| Points | diem | int | 0-1000 |
| Order | viTri | int | Position |
| AnswerCount | soPhuongAn | int | Denormalized |
| CreatedAt | thoiGianTao | datetime2 | |
| UpdatedAt | thoiGianCapNhat | datetime2 | |
| DeletedAt | thoiGianXoa | datetime2 | Soft Delete |

### Answer (PhuongAn)

| C# Property | Vietnamese Column | Type | Notes |
|---|---|---|---|
| Id | idPhuongAn | int | PK |
| QuestionId | idCauHoi | int | FK |
| Content | noiDungPhuongAn | nvarchar(max) | |
| IsCorrect | laKetQuaDung | bit | |
| Order | viTri | int | |
| SelectCount | lanChon | int | Denormalized |
| ImageUrl | urlAnhPhuongAn | nvarchar(500) | Nullable |
| CreatedAt | thoiGianTao | datetime2 | |
| UpdatedAt | thoiGianCapNhat | datetime2 | |

### GameSession (PhienChoi)

| C# Property | Vietnamese Column | Type | Notes |
|---|---|---|---|
| Id | idPhienChoi | int | PK |
| QuizSetId | idBoTrucNghiem | int | FK |
| HostId | idNguoiTochuc | int | FK to NguoiDung |
| PIN | maPIN | char(6) | UNIQUE, 6-digit |
| Status | trangThai | varchar(20) | ENUM |
| CurrentQuestionIndex | indexCauHoiHienTai | int | 0-based |
| PlayerCount | soNguoiChoi | int | |
| SkippedCount | soCauHoiBoQua | int | |
| StartedAt | thoiGianBatDau | datetime2 | Nullable |
| EndedAt | thoiGianKetThuc | datetime2 | Nullable |
| CreatedAt | thoiGianTao | datetime2 | |
| DeletedAt | thoiGianXoa | datetime2 | Soft Delete |

### Player (NguoiChoi)

| C# Property | Vietnamese Column | Type | Notes |
|---|---|---|---|
| Id | idNguoiChoi | int | PK |
| GameSessionId | idPhienChoi | int | FK |
| DisplayName | tenNguoiChoi | nvarchar(100) | |
| AvatarColor | mauNenHoa | varchar(20) | |
| HasAnswered | daCauTraLoi | bit | |
| IsVisible | hienCau | bit | |
| ConnectionStatus | trangThaiKetNoi | varchar(50) | |
| JoinedAt | thoiGianJoin | datetime2 | |
| LeftAt | thoiGianRoiDi | datetime2 | Nullable |
| CreatedAt | thoiGianTao | datetime2 | |

### PlayerAnswer (TraLoiCauHoi)

| C# Property | Vietnamese Column | Type | Notes |
|---|---|---|---|
| Id | idTraLoiCauHoi | int | PK |
| PlayerId | idNguoiChoi | int | FK |
| SessionQuestionId | idCauHoiTrongPhien | int | FK |
| AnswerContent | traLoi | nvarchar(max) | JSON |
| IsCorrect | dung | bit | |
| PointsEarned | diemNhan | int | |
| ResponseTime | thoiGianTraLoi_Ms | int | Milliseconds |
| CreatedAt | thoiGianTao | datetime2 | |

### Challenge (ThachThuc)

| C# Property | Vietnamese Column | Type | Notes |
|---|---|---|---|
| Id | idThachThuc | int | PK |
| QuizSetId | idBoTrucNghiem | int | FK |
| CreatedById | idNguoiTao | int | FK |
| Title | tenThachThuc | nvarchar(255) | |
| Description | moTa | nvarchar(max) | Nullable |
| LinkToken | tokenLienKet | varchar(50) | UNIQUE |
| Status | trangThai | varchar(50) | ENUM |
| StartDate | thoiGianBatDau | datetime2 | |
| EndDate | thoiGianKetThuc | datetime2 | |
| CreatedAt | thoiGianTao | datetime2 | |
| UpdatedAt | thoiGianCapNhat | datetime2 | |
| DeletedAt | thoiGianXoa | datetime2 | Soft Delete |

---

## 3. FLUENT API MAPPING CONFIGURATION

### Base Configuration Pattern

```csharp
// Example using Fluent API to map English C# to Vietnamese database
protected override void OnModelCreating(ModelBuilder modelBuilder)
{
    base.OnModelCreating(modelBuilder);

    // User → NguoiDung
    modelBuilder.Entity<User>()
        .ToTable("NguoiDung")
        .Property(u => u.Id)
        .HasColumnName("idNguoiDung");

    modelBuilder.Entity<User>()
        .Property(u => u.Email)
        .HasColumnName("email")
        .IsRequired();

    modelBuilder.Entity<User>()
        .Property(u => u.PasswordHash)
        .HasColumnName("matKhau");

    modelBuilder.Entity<User>()
        .Property(u => u.FirstName)
        .HasColumnName("tenDem");

    modelBuilder.Entity<User>()
        .Property(u => u.LastName)
        .HasColumnName("tenGoi");

    modelBuilder.Entity<User>()
        .Property(u => u.Role)
        .HasColumnName("vaiTro")
        .HasConversion(
            v => v.ToString(),
            v => (UserRole)Enum.Parse(typeof(UserRole), v)
        );

    modelBuilder.Entity<User>()
        .Property(u => u.AvatarUrl)
        .HasColumnName("urlAnhDaiDien");

    modelBuilder.Entity<User>()
        .Property(u => u.Bio)
        .HasColumnName("gioiThieu");

    modelBuilder.Entity<User>()
        .Property(u => u.CreatedAt)
        .HasColumnName("thoiGianTao")
        .HasDefaultValueSql("GETUTCDATE()");

    modelBuilder.Entity<User>()
        .Property(u => u.UpdatedAt)
        .HasColumnName("thoiGianCapNhat")
        .HasDefaultValueSql("GETUTCDATE()");

    modelBuilder.Entity<User>()
        .Property(u => u.DeletedAt)
        .HasColumnName("thoiGianXoa");

    // Index configuration
    modelBuilder.Entity<User>()
        .HasIndex(u => u.Email)
        .IsUnique()
        .HasDatabaseName("idx_nguoiDung_email");

    modelBuilder.Entity<User>()
        .HasQueryFilter(u => u.DeletedAt == null);
}
```

---

## 4. ENUM MAPPINGS

### UserRole (vaiTro)
- GIAOVIEN = Teacher
- QUANTRI = Administrator

### GameStatus (trangThai)
- CHO = Waiting
- DANG_CHOI = In Progress
- KET_THUC = Finished

### QuestionType (loaiCauHoi)
- TRACHOI = Multiple Choice
- DUNG_SAI = True/False
- GHEP = Matching
- SAPXEP = Ordering
- VIDEO = Video

### ConnectionStatus (trangThaiKetNoi)
- KET_NOI = Connected
- NGAT_KET_NOI = Disconnected
- ROI_DI = Left

### ChallengeStatus (trangThai)
- DANG_HOAT_DONG = Active
- DUNG_HOAT_DONG = Inactive

### FilterLevel (mucDo)
- CANH_BAO = Warning
- CAM = Block

---

## 5. NAMING CONVENTIONS

### Database (SQL Server)

**Pattern:**
- **Table Names:** PascalCase Vietnamese (NguoiDung, BoTrucNghiem)
- **Column Names:** camelCase Vietnamese (idNguoiDung, tenGoi, thoiGianTao)
- **Primary Keys:** id{TableNameSingular} (idNguoiDung, idBoTrucNghiem)
- **Foreign Keys:** id{ReferencedTableName} (idNguoiDung, idBoTrucNghiem)
- **Indexes:** idx_{TableName}_{ColumnName} (idx_nguoiDung_email)

### C# Code

**Pattern:**
- **Class Names:** PascalCase English (User, QuizSet, GameSession)
- **Property Names:** PascalCase English (Id, Email, DisplayName)
- **Method Names:** PascalCase English (GetUserById, CreateQuizSet)
- **Variable Names:** camelCase English (userId, quizTitle)

---

## 6. SOFT DELETE PATTERN

All entities with soft delete support:
- User (NguoiDung)
- QuizSet (BoTrucNghiem)
- Question (CauHoi)
- GameSession (PhienChoi)
- Challenge (ThachThuc)

**Implementation:**
```csharp
// Soft delete configuration
modelBuilder.Entity<QuizSet>()
    .Property(q => q.DeletedAt)
    .HasColumnName("thoiGianXoa");

// Global query filter
modelBuilder.Entity<QuizSet>()
    .HasQueryFilter(q => q.DeletedAt == null);

// Filtered index
modelBuilder.Entity<QuizSet>()
    .HasIndex(q => q.UserId)
    .HasFilter("[thoiGianXoa] IS NULL")
    .HasDatabaseName("idx_boTrucNghiem_idNguoiDung");
```

---

## 7. UNIQUE CONSTRAINTS

| Table | Column(s) | Constraint Name |
|---|---|---|
| NguoiDung | email | uk_nguoiDung_email |
| PhienChoi | maPIN | uk_phienChoi_maPIN |
| BoTrucNghiem | tenBoTrucNghiem, idNguoiDung | uk_boTrucNghiem_tenBoTrucNghiem_idNguoiDung |
| ThachThuc | tokenLienKet | uk_thachThuc_tokenLienKet |

---

## 8. TEMPORAL COLUMNS

All entities follow this pattern:

```csharp
public DateTime CreatedAt { get; set; } // thoiGianTao
public DateTime UpdatedAt { get; set; } // thoiGianCapNhat
public DateTime? DeletedAt { get; set; } // thoiGianXoa (Nullable)
```

**Configuration:**
```csharp
modelBuilder.Entity<User>()
    .Property(u => u.CreatedAt)
    .HasColumnName("thoiGianTao")
    .HasDefaultValueSql("GETUTCDATE()")
    .ValueGeneratedOnAdd();

modelBuilder.Entity<User>()
    .Property(u => u.UpdatedAt)
    .HasColumnName("thoiGianCapNhat")
    .HasDefaultValueSql("GETUTCDATE()")
    .ValueGeneratedOnAddOrUpdate();
```

---

## Quick Reference

**To add a new entity mapping:**

1. Create C# class with English names (PascalCase)
2. Add `.ToTable("VietnameseName")` in OnModelCreating
3. Map each property with `.HasColumnName("vietnameseName")`
4. Create migration: `Add-Migration AddEntityName`
5. Update database: `Update-Database`

**Example:**
```csharp
public class GameSession
{
    public int Id { get; set; }
    public string PIN { get; set; }
    public DateTime StartedAt { get; set; }
    public DateTime? EndedAt { get; set; }
    public DateTime CreatedAt { get; set; }
}

// In DbContext
modelBuilder.Entity<GameSession>()
    .ToTable("PhienChoi")
    .Property(g => g.Id).HasColumnName("idPhienChoi")
    .Property(g => g.PIN).HasColumnName("maPIN")
    .Property(g => g.StartedAt).HasColumnName("thoiGianBatDau")
    .Property(g => g.EndedAt).HasColumnName("thoiGianKetThuc")
    .Property(g => g.CreatedAt).HasColumnName("thoiGianTao");
```

---

**Complete Reference: English (Code) ↔ Vietnamese (Database) ✅**
