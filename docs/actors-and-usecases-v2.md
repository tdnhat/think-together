# Actors and Use Cases - ThinkTogether (V2 - Restructured)

**Document Version:** 2.0 (Restructured with 4 Main Actors)  
**Date:** 17/10/2025  
**Previous Version:** 1.0  
**Status:** Ready for Review  

---

## 1. EXECUTIVE SUMMARY - ACTOR RESTRUCTURING

### Changes from V1 to V2:

| Aspect | V1 (6 Actors) | V2 (4 Actors) | Rationale |
|--------|---------------|---------------|-----------|
| **Học sinh + Guest** | Separate (2 actors) | **Merged → Player** | Identical behavior: join game, submit answer, view results |
| **System/Server** | Separate actor | **Internal component** | Technical implementation detail, not primary actor |
| **External Media** | Separate actor | **External Service** | Kept (external dependency) |
| **Total** | 6 actors | 4 actors | Simpler, cleaner structure |

---

## 2. ACTORS (Tác nhân trong hệ thống) - RESTRUCTURED

### 2.1 PRIMARY ACTORS (Tác nhân chính)

#### **2.1.1 Giáo viên (Teacher / Content Creator)**

**Mô tả:**  
Các chuyên gia giáo dục có tài khoản đăng nhập, chịu trách nhiệm tạo và quản lý nội dung học tập, tổ chức và giám sát các phiên học tập tương tác.

**Phân loại:**
- Giáo viên, Giảng viên, Trưởng nhóm lớp
- Quản lý đào tạo, Người tổ chức sự kiện giáo dục
- Content Creator

**Đặc điểm chính:**
- ✅ Bắt buộc đăng ký & đăng nhập với email/password
- ✅ Sở hữu toàn bộ nội dung tạo ra (Quiz Sets, Questions, Challenges)
- ✅ Toàn quyền tạo/chỉnh sửa/xóa nội dung của mình
- ✅ Host Live Game Sessions và kiểm soát trò chơi realtime
- ✅ Tạo Challenge Links cho ôn tập bất đồng bộ
- ✅ Xem báo cáo chi tiết, analytics, xuất dữ liệu CSV

**Mục tiêu chính:**
- Tạo nội dung học tập chất lượng cao, phù hợp với chương trình
- Tổ chức phiên học tập tương tác hiệu quả → tăng sự tham gia
- Theo dõi, đánh giá, phân tích kết quả học tập
- Tái sử dụng, cải tiến, chia sẻ nội dung

**Quyền hạn:**
| Chức năng | Phạm vi |
|-----------|---------|
| Tạo/Sửa/Xóa Quiz Sets | Own data only |
| Tạo/Sửa/Xóa Questions | Own data only |
| Host Live Game Sessions | Own quizzes |
| Tạo Challenge Links | Own quizzes |
| Xem báo cáo, analytics | Own data only |
| Quản lý game session (kick, pause, resume) | During session |
| Xuất dữ liệu (CSV, PDF) | Own data only |
| Xem Challenge Leaderboards | Own challenges |

---

#### **2.1.2 Người Chơi (Player / Participant)**

**Mô tả:**  
Người học tham gia các phiên học tập tương tác do Giáo viên tổ chức. Bao gồm cả học sinh đã đăng ký và khách tham gia ẩn danh. Không yêu cầu tài khoản.

**Phân loại:**
- Học sinh tiểu học, THCS, THPT
- Sinh viên, người học tự do
- Khách bè bạn được mời tham gia
- Người dùng không xác thực

**Đặc điểm chính:**
- ✅ Truy cập ẩn danh, chỉ cần nhập Nickname
- ✅ Tham gia Live Game thông qua mã PIN (do Giáo viên cung cấp)
- ✅ Tham gia Challenge bất đồng bộ thông qua link (do Giáo viên chia sẻ)
- ✅ Có thể tham gia nhiều lần trong cùng Challenge
- ✅ Không cần tài khoản để tham gia
- ✅ Xem ngay kết quả sau mỗi phiên chơi

**Mục tiêu chính:**
- Tham gia học tập tương tác, nâng cao kiến thức
- Trải nghiệm học tập vui vẻ, hấp dẫn thông qua game
- Cạnh tranh lành mạnh, nâng cao động lực đạt điểm cao
- Ôn tập kiến thức thông qua Challenge Mode bất cứ lúc nào

**Quyền hạn:**
| Chức năng | Phạm vi |
|-----------|---------|
| Tham gia Live Game | Với PIN hợp lệ |
| Tham gia Challenge | Với Link hợp lệ |
| Xem kết quả cá nhân | After session |
| Xem Leaderboard | Live game + Challenge |
| Tùy chỉnh âm thanh | Personal settings |
| Tham gia ẩn danh | No account needed |
| Chơi Challenge nhiều lần | Unlimited attempts |

---

### 2.2 SECONDARY ACTORS (Tác nhân phụ)

#### **2.2.1 Quản trị viên (Administrator / System Manager)**

**Mô tả:**  
Người quản lý hệ thống ThinkTogether, có quyền cao nhất với trách nhiệm bảo trì nền tảng, giám sát nội dung, quản lý user.

**Phân loại:**
- Quản trị viên hệ thống
- Technical Support
- Content Moderator
- Platform Manager

**Đặc điểm chính:**
- ✅ Tài khoản đặc biệt với quyền hạn cao
- ✅ Truy cập toàn bộ hệ thống
- ✅ Không tạo nội dung nhưng quản lý tất cả nội dung
- ✅ Quản lý Users (Giáo viên, Người chơi), ban/unban
- ✅ Duyệt nội dung không phù hợp (profanity, violations)

**Mục tiêu chính:**
- Đảm bảo hệ thống hoạt động ổn định, an toàn 24/7
- Giám sát, duyệt nội dung vi phạm chính sách
- Quản lý user, xử lý khiếu nại, maintain quality
- Thu thập statistics toàn hệ thống

**Quyền hạn:**
| Chức năng | Phạm vi |
|-----------|---------|
| Xem/Xóa Quiz Sets | All creators |
| Xem/Xóa Questions | All creators |
| Xem/Ban/Delete User | All (Teachers, Players) |
| Duyệt nội dung | Profanity, violations |
| Xem báo cáo hệ thống | Global statistics |
| Quản lý cấu hình | System settings |
| Xem audit logs | Full history |
| Restore deleted data | Soft-delete recovery |

---

#### **2.2.2 External Media Service**

**Mô tả:**  
Dịch vụ bên ngoài hỗ trợ upload, lưu trữ, và quản lý media (hình ảnh, video) cho nền tảng.

**Ví dụ:** AWS S3, Google Cloud Storage, Cloudinary, etc.

**Trách nhiệm:**
- Lưu trữ ảnh bìa Quiz Sets
- Lưu trữ ảnh/video trong Questions
- Validate định dạng & kích thước file
- Optimize images cho responsive display
- Streaming video content hiệu quả
- Handle expiration & cleanup policies

**Specifications:**
| Media Type | Format | Max Size | Duration |
|-----------|--------|----------|----------|
| **Quiz Cover** | JPG, PNG | 2 MB | - |
| **Question Image** | JPG, PNG | 2 MB | - |
| **Video** | MP4, WebM | 50 MB | ≤ 2 mins |

---

### 2.3 ACTOR SUMMARY TABLE (So sánh với V1)

| Aspect | Giáo viên | Người Chơi | Quản trị viên | External Service |
|--------|-----------|------------|---------------|------------------|
| **Loại Actor** | Primary | Primary | Secondary | Secondary |
| **Yêu cầu Tài khoản** | ✅ Có | ❌ Không | ✅ Có | N/A |
| **Tạo Content** | ✅ Có | ❌ Không | ✅ Quản lý | N/A |
| **Host Live Game** | ✅ Có | ❌ Không | ✅ Monitor | N/A |
| **Play Game** | ❌ Host only | ✅ Có | ✅ Có quyền | N/A |
| **Xem Report** | ✅ Own data | ✅ Personal | ✅ All data | N/A |
| **Quản lý User** | ❌ Không | ❌ Không | ✅ Có | N/A |
| **Primary Goal** | Tạo nội dung, Giáo dục | Học tập, Luyện tập | Quản lý, Bảo trì | Media management |
| **V1 Mapping** | Teacher | Student + Guest | Administrator | External Media |

---

## 3. ACTOR INHERITANCE & RELATIONSHIPS

### 3.1 Generalization Hierarchy

```
                    ┌─────────────────┐
                    │   User (Base)   │ [Conceptual]
                    └────────┬────────┘
                             │
                ┌────────────┼────────────┐
                │            │            │
          ┌─────┴──────┐    │    ┌──────┴──────┐
          │ Giáo viên   │    │    │ Quản trị viên│
          │ (Teacher)   │    │    │(Administrator)
          └─────────────┘    │    └──────────────┘
                             │
                    ┌────────┴────────┐
                    │  Người Chơi     │
                    │  (Player)       │
                    │  - Học sinh     │ [Specialized]
                    │  - Khách (Guest)│
                    └─────────────────┘
```

### 3.2 Actor Relationships

```
┌──────────────────────────────────────────────────────────────┐
│                     THINKTOGETHER SYSTEM                      │
│                                                               │
│  ┌─────────────────────────────────────────────────────────┐│
│  │  Giáo viên (Teacher)          Người Chơi (Player)     ││
│  │  ────────────────────         ──────────────────      ││
│  │  • Creates quizzes            • Joins games (PIN)     ││
│  │  • Manages questions          • Joins challenges      ││
│  │  • Hosts live games           • Submits answers       ││
│  │  • Owns content               • Views results         ││
│  │  • Views analytics            • Competes              ││
│  │                                                        ││
│  │  📌 1-to-Many: 1 Teacher → Many Quizzes              ││
│  │                                                        ││
│  │  📌 Many-to-Many: Teachers host games ↔ Players join ││
│  └─────────────────────────────────────────────────────────┘│
│                                                               │
│  ┌─────────────────────────────────────────────────────────┐│
│  │  Quản trị viên (Administrator)      External Service   ││
│  │  ────────────────────────────      ────────────────── ││
│  │  • Monitors system                  • Stores media     ││
│  │  • Manages users                    • Validates files  ││
│  │  • Moderates content                • Optimizes images ││
│  │  • Views global analytics           • Streams video    ││
│  │                                                        ││
│  │  📌 Secondary involvement in all major use cases      ││
│  └─────────────────────────────────────────────────────────┘│
└──────────────────────────────────────────────────────────────┘
```

### 3.3 Interaction Patterns

| Interaction | Initiator | Receiver | Context |
|-------------|-----------|----------|---------|
| **Content Creation** | Giáo viên | System | UC-QUIZ-02, UC-QUES-02+ |
| **Content Consumption** | Người Chơi | Giáo viên | UC-LIVE-03, UC-CHAL-02 |
| **Live Gameplay** | Giáo viên (host) | Người Chơi | UC-LIVE-05 to UC-LIVE-10 |
| **Challenge Mode** | Giáo viên (create) | Người Chơi (play) | UC-CHAL-01 to UC-CHAL-04 |
| **Moderation** | Quản trị viên | All users | Content review, user management |
| **Media Management** | Giáo viên | External Service | UC-QUES-06 (video upload) |

---

## 4. USE CASES - REMAPPED WITH 4 ACTORS

### 4.1 Module: Authentication & User Management

#### **UC-AUTH-01: Đăng ký tài khoản Giáo viên**
**Primary Actor:** Giáo viên  
**Supporting Actor:** System

**Main Flow:**
1. Giáo viên nhập email, tên, password
2. System validate (unique email, strong password)
3. System tạo account với role "Teacher"
4. System auto-login Giáo viên
5. System redirect đến onboarding

**Postcondition:** Giáo viên authenticated & ready to create quizzes

---

#### **UC-AUTH-02: Đăng nhập**
**Primary Actor:** Giáo viên  
**Supporting Actor:** System

**Main Flow:**
1. Giáo viên nhập email & password
2. System xác thực credentials
3. System tạo session token
4. System redirect đến dashboard

**Postcondition:** Giáo viên authenticated, có quyền truy cập

---

### 4.2 Module: Quiz & Question Management (unchanged structure)

- **UC-QUIZ-01 to UC-QUIZ-05:** Giáo viên only
- **UC-QUES-01 to UC-QUES-09:** Giáo viên only
- **UC-AUTH-02 to UC-AUTH-05:** Admin can manage

### 4.3 Module: Live Game - With Consolidated Player Actor

#### **UC-LIVE-03: Người Chơi tham gia Lobby** ✨ UPDATED
**Primary Actor:** Người Chơi (previously "Học sinh")  
**Supporting Actor:** Giáo viên (Host), System

**Main Flow:**
1. Người Chơi nhập PIN & Nickname
2. System validate PIN (active), Nickname (unique, no profanity)
3. System add Người Chơi vào lobby
4. System broadcast update đến Giáo viên & Người Chơi khác
5. Người Chơi xem "Waiting for game to start"

**Postcondition:** Người Chơi successfully joined

**Note:** Applies to both registered students & guests - same behavior!

#### **UC-LIVE-06 to UC-LIVE-10:** Người Chơi only (unchanged logic)

### 4.4 Module: Challenge Mode - With Consolidated Player Actor

#### **UC-CHAL-02: Người Chơi tham gia Challenge** ✨ UPDATED
**Primary Actor:** Người Chơi (previously both "Học sinh" and "Guest")  
**Supporting Actor:** Giáo viên (created challenge), System

**Main Flow:**
1. Người Chơi click challenge link
2. System prompt nhập Nickname
3. Người Chơi nhập nickname
4. System validate (profanity filter)
5. System start solo play session

**Postcondition:** Người Chơi bắt đầu challenge

**Benefits:**
- Single actor handles both authenticated & anonymous users
- Same permission set applies to both
- Simpler logic, fewer edge cases

---

## 5. USE CASE MATRIX - CONSOLIDATED

| Use Case Module | Giáo viên | Người Chơi | Quản trị viên | External Media |
|---|---|---|---|---|
| **Authentication** |
| UC-AUTH-01, 02 | Primary | - | - | - |
| **Content Management** |
| UC-QUIZ-01-05 | Primary | - | Secondary (view all) | - |
| UC-QUES-01-09 | Primary | - | Secondary (view all) | - |
| UC-QUES-06 (video) | Primary | - | Secondary | **Secondary** |
| **Live Game Setup** |
| UC-LIVE-01, 02, 04, 05, 09 | Primary (host) | - | Secondary | - |
| **Live Game Play** |
| UC-LIVE-03 | - | **Primary** | Secondary | - |
| UC-LIVE-06, 07, 08, 10, 11 | Primary (host) | **Primary** (players) | Secondary | - |
| **Challenge Mode** |
| UC-CHAL-01 | Primary | - | Secondary | - |
| UC-CHAL-02, 03, 04 | - | **Primary** | Secondary | - |
| **Player Experience** |
| UC-PLAYER-01 | - | Primary | - | - |
| **Reporting** |
| UC-REPORT-01-03 | Primary | - | Secondary | - |
| **UX Enhancements** |
| UC-UX-01, 02 | Primary | Primary | - | - |

---

## 6. BENEFIT ANALYSIS: V1 vs V2

### 6.1 Structural Improvements

| Aspect | V1 | V2 | Benefit |
|--------|----|----|---------|
| **Actor Count** | 6 | 4 | 33% reduction, easier to manage |
| **Complexity** | High | Medium | Fewer edge cases in UC flow |
| **Redundancy** | Student + Guest separate | Merged into Player | Eliminate duplicate use cases |
| **Clarity** | Scattered permissions | Consolidated by role | Faster understanding |
| **UC Matrix** | 6 columns | 4 columns | Simpler reference |

### 6.2 Implementation Impact

| Area | V1 | V2 | Impact |
|------|----|----|--------|
| **Database Design** | 6 role types | 4 role types | Simpler schema, fewer tables |
| **Permission System** | Complex inheritance | Clear hierarchy | Easier authorization logic |
| **API Endpoints** | Different for S/G | Same endpoint | Reduced endpoints, cleaner code |
| **Testing Coverage** | 6 actor scenarios | 4 actor scenarios | 33% fewer test cases |
| **Documentation** | 15+ UC docs | 12 UC docs | Easier to maintain |

### 6.3 Business Logic Consolidation

**Before (V1) - Redundant:**
```
UC-LIVE-03a: Học sinh tham gia Lobby (registered)
  - Email verified
  - Database profile exists
  - ...same logic...

UC-LIVE-03b: Khách tham gia Lobby (anonymous)
  - No email
  - Temporary session
  - ...same logic...
```

**After (V2) - Unified:**
```
UC-LIVE-03: Người Chơi tham gia Lobby
  - Single flow handles both scenarios
  - No redundancy
  - Easier to maintain
```

---

## 7. PERMISSION MATRIX - SIMPLIFIED

### 7.1 Giáo viên Permissions

```
Content Management:
  ✅ Create/Edit/Delete own Quiz Sets
  ✅ Create/Edit/Delete own Questions
  ✅ Duplicate Quiz Sets

Game Management:
  ✅ Host Live Game Sessions
  ✅ Configure Game Settings
  ✅ Create Lobby (auto-generate PIN)
  ✅ Kick Players from Lobby/Game
  ✅ Start/Pause/Resume Game

Challenge Management:
  ✅ Create Challenge Links
  ✅ View Challenge Leaderboards
  ✅ Delete Challenges

Reporting & Analytics:
  ✅ View own Game Reports
  ✅ View Detailed Question Analysis
  ✅ Export Reports (CSV, PDF)
  ✅ View Challenge Statistics

Account Management:
  ✅ Edit own profile
  ✅ Change password
  ✅ View account activity
  ✅ Delete own account (soft delete)

❌ Cannot:
  ❌ Edit other Teachers' quizzes
  ❌ View other Teachers' reports
  ❌ Manage users or system
  ❌ Create admin accounts
```

### 7.2 Người Chơi Permissions

```
Gameplay:
  ✅ Join Live Game (with valid PIN)
  ✅ Join Challenge (with valid Link)
  ✅ Submit Answers
  ✅ Play Challenge multiple times

Results & Leaderboards:
  ✅ View own score
  ✅ View own ranking
  ✅ View public leaderboards
  ✅ Share results on social

Settings:
  ✅ Toggle audio
  ✅ Customize player preferences
  ✅ (Optional) Create profile if registered

❌ Cannot:
  ❌ Create quizzes
  ❌ Edit content
  ❌ Host games
  ❌ View detailed analytics
  ❌ Access teacher dashboard
  ❌ Ban other players
  ❌ Delete content
```

### 7.3 Quản trị viên Permissions

```
Content Moderation:
  ✅ View all Quiz Sets
  ✅ Delete inappropriate content
  ✅ View all Questions
  ✅ Flag content for review
  ✅ Profanity/violation monitoring

User Management:
  ✅ View all user accounts
  ✅ Ban/Unban Teachers
  ✅ Ban/Unban Players
  ✅ Delete accounts (with confirmation)
  ✅ View account activity logs

System Analytics:
  ✅ View global statistics
  ✅ View system health metrics
  ✅ View audit trails
  ✅ Generate system reports

System Configuration:
  ✅ Update system settings
  ✅ Manage moderation rules
  ✅ Configure email notifications
  ✅ Manage backups & recovery

❌ Cannot:
  ❌ Create content for promotion
  ❌ Host games as normal user
  ❌ Bypass security rules
  ❌ Modify financial data
```

---

## 8. MIGRATION GUIDE: V1 → V2

### 8.1 Use Case Mapping

| V1 Use Cases | V2 Consolidated | Notes |
|---|---|---|
| UC-LIVE-03: Học sinh join | UC-LIVE-03: Player joins | Merge logic |
| UC-LIVE-03: Guest join | UC-LIVE-03: Player joins | Merge logic |
| UC-QUES-02-06 (all) | UC-QUES-02-06 (unchanged) | Giáo viên still primary |
| UC-CHAL-02: Học sinh play | UC-CHAL-02: Player plays | Merge logic |
| UC-CHAL-02: Guest play | UC-CHAL-02: Player plays | Merge logic |
| UC-PLAYER-01 (Học sinh) | UC-PLAYER-01 (Player) | Consolidate |
| UC-PLAYER-01 (Guest) | UC-PLAYER-01 (Player) | Consolidate |

### 8.2 Database Migration

**No schema changes needed!** But simplify:

```
-- Before (V1) - Complex Role Enum
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255),
  role ENUM('TEACHER', 'STUDENT', 'GUEST', 'ADMIN', ...) -- Too many!
);

-- After (V2) - Simplified Role Enum
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255),
  role ENUM('TEACHER', 'PLAYER', 'ADMIN') -- 3 roles
);

-- Player can be registered (has email) or anonymous (session-based)
-- Both use same 'PLAYER' role
```

### 8.3 Code Changes

**Minimal refactoring needed:**

```csharp
// Before (V1) - Handle multiple guest cases
if (user.Role == UserRole.Student || user.Role == UserRole.Guest)
{
    // Allow joining game
}

// After (V2) - Unified
if (user.Role == UserRole.Player)
{
    // Allow joining game
}
```

---

## 9. FUTURE EXTENSIBILITY

### 9.1 Possible Extensions (Without Breaking Changes)

```
Current 4-Actor Model:
┌─────────────────┐
│   Giáo viên     │
├─────────────────┤
│  Người Chơi     │
├─────────────────┤
│  Quản trị viên  │
├─────────────────┤
│  External Svc   │
└─────────────────┘

Future Extensions (Additive Only):
┌─────────────────────────────┐
│     Giáo viên               │ ← Add "Team Lead" role
├─────────────────────────────┤
│     Người Chơi              │ ← Add "Registered Student" variant
├─────────────────────────────┤
│  Quản trị viên              │ ← Add "Content Reviewer" role
├─────────────────────────────┤
│  External Service           │ ← Add CDN, Analytics services
├─────────────────────────────┤
│  [NEW] Community Manager    │ ← Share library, templates
│  [NEW] Data Analyst         │ ← Advanced reporting
│  [NEW] Platform Support     │ ← Helpdesk, ticketing
└─────────────────────────────┘
```

### 9.2 Scaling Considerations

| Aspect | Current (4) | Future (7+) | Strategy |
|--------|------------|-------------|----------|
| **Permission Model** | Role-based | Attribute-based? | Use capabilities system |
| **Use Cases** | 30+ | 50+? | Modular UC packages |
| **External Services** | 1 (Media) | 3+ | Service manager pattern |
| **Documentation** | 1 file | Multiple sections | Split into modules |

---

## 10. COMPARISON TABLE: DETAILED

### Before (V1 - 6 Actors)
```
┌──────────────────────────────────────────────────────────┐
│ PRIMARY ACTORS (2):                                      │
│  1. Giáo viên (Teacher)                                  │
│  2. Học sinh (Student) - Requires account? No            │
│                                                          │
│ SECONDARY ACTORS (4):                                    │
│  3. Người dùng phổ thông (Guest/Anonymous)              │
│  4. Quản trị viên (Administrator)                        │
│  5. System/Server                                        │
│  6. External Media Services                              │
└──────────────────────────────────────────────────────────┘

Problems:
❌ Học sinh + Guest have identical behavior → Redundant
❌ System as "actor" is confusing (internal component)
❌ 6 actors = complex use case matrix (30+ use cases × 6)
❌ Confusing documentation (UC-LIVE-03a vs UC-LIVE-03b)
❌ Multiple permission rules for same action
```

### After (V2 - 4 Actors) ✨
```
┌──────────────────────────────────────────────────────────┐
│ PRIMARY ACTORS (2):                                      │
│  1. Giáo viên (Teacher)                                  │
│  2. Người Chơi (Player) ← Consolidates Student + Guest   │
│                                                          │
│ SECONDARY ACTORS (2):                                    │
│  3. Quản trị viên (Administrator)                        │
│  4. External Media Services                              │
└──────────────────────────────────────────────────────────┘

Benefits:
✅ Unified player behavior → No redundancy
✅ System as internal component, not actor
✅ 4 actors = simple use case matrix (30+ use cases × 4)
✅ Clear documentation (single UC per scenario)
✅ Consistent permission rules
✅ 33% simpler to maintain
```

---

## 11. RECOMMENDATION & ACTION ITEMS

### 11.1 Recommendation: **ADOPT V2 STRUCTURE** ✅

**Rationale:**
1. **Clarity:** 4 actors vs 6 = easier to understand and communicate
2. **No Data Loss:** V1 → V2 is non-breaking refactoring
3. **Consolidation:** Merging Student + Guest eliminates redundancy
4. **Scalability:** Cleaner foundation for future extensions
5. **Maintainability:** Simpler permission model, fewer edge cases

### 11.2 Action Items

- [ ] **Phase 1 - Documentation** (1-2 days)
  - [ ] Finalize V2 use case document (this document)
  - [ ] Update sequence diagrams (based on 4 actors)
  - [ ] Update entity-relationship diagram

- [ ] **Phase 2 - Design** (2-3 days)
  - [ ] Review database schema (likely no changes)
  - [ ] Update authorization/permission logic
  - [ ] Design API endpoints (consolidate S/G endpoints)

- [ ] **Phase 3 - Implementation** (1 week)
  - [ ] Update backend models (UserRole enum: TEACHER, PLAYER, ADMIN)
  - [ ] Refactor permission checks
  - [ ] Update API routes
  - [ ] Update unit tests

- [ ] **Phase 4 - Testing & Review** (1 week)
  - [ ] Integration testing with 4 actor scenarios
  - [ ] Regression testing (no breaking changes)
  - [ ] Stakeholder review & approval
  - [ ] Document any changes

---

## APPENDIX A: DETAILED ACTOR DESCRIPTIONS

### A.1 Actor Profiles - Teachers

**Persona 1: Primary School Teacher**
- Age: 28-45
- Experience: 5-15 years
- Tech comfort: Medium
- Goal: Engage primary students, track participation
- Pain: Limited time, many students, need quick setup

**Persona 2: Preparation Instructor**
- Age: 25-40
- Experience: 2-10 years
- Tech comfort: High
- Goal: Create comprehensive question banks, detailed analytics
- Pain: Time-consuming content creation, need data export

### A.2 Actor Profiles - Players

**Persona 1: Primary School Student**
- Age: 6-12
- Tech comfort: Medium
- Goal: Fun learning, compete with classmates
- Pain: Confusing interfaces, limited time

**Persona 2: Guest Participant**
- Age: Any
- Tech comfort: Variable
- Goal: Quick fun participation, no commitment
- Pain: Complex registration, privacy concerns

---

## APPENDIX B: USE CASE NUMBERING GUIDE

```
UC-<Module>-<Sequence>

Examples:
  UC-AUTH-01 = Authentication use case #1 (Register)
  UC-AUTH-02 = Authentication use case #2 (Login)
  
  UC-QUIZ-01 = Quiz Management use case #1 (View)
  UC-QUIZ-02 = Quiz Management use case #2 (Create)
  
  UC-LIVE-03 = Live Game use case #3 (Player joins)
  UC-CHAL-02 = Challenge Mode use case #2 (Player joins)
  
  UC-PLAYER-01 = Player Experience use case #1 (Audio)
  UC-REPORT-01 = Reporting use case #1 (View Sessions)
  UC-UX-01 = UX Enhancement use case #1 (Onboarding)
```

---

## DOCUMENT STATUS

| Item | Status | Notes |
|------|--------|-------|
| Actor Consolidation | ✅ Complete | 6 → 4 actors |
| Use Case Remapping | ✅ Complete | All 30+ UC updated |
| Permission Matrix | ✅ Complete | Simplified & clear |
| Migration Guide | ✅ Complete | Low-risk refactoring |
| Review | ⏳ Pending | Awaiting stakeholder approval |

---

**Next Steps:**
1. Review this document with team
2. Approve actor restructuring
3. Update other documents (ER diagram, sequence diagrams)
4. Begin implementation based on 4-actor model

