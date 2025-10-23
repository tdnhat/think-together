# Lược Đồ Quan Hệ Thực Thể - Tiếng Việt
# Entity Relationship Diagram - Vietnamese

**Phiên Bản:** 1.0 - 100% Tiếng Việt  
**Ngày:** 17 Tháng 10 Năm 2025  
**Mục Đích:** ERD đầy đủ bao gồm tất cả tính năng, diễn viên, và trường hợp sử dụng

---

## 1. DANH SÁCH BẢNG - 24 ENTITIES

### Người Dùng & Xác Thực (2)
1. **NguoiDung** - Người dùng (Giáo viên, Quản trị)
2. **VaiTro** - Vai trò

### Quản Lý Nội Dung (7)
3. **BoTrucNghiem** - Bộ trắc nghiệm
4. **CauHoi** - Câu hỏi
5. **LoaiCauHoi** - Loại câu hỏi
6. **PhuongAn** - Phương án (Multiple choice)
7. **CapGhep** - Cặp ghép (Matching)
8. **MucSapXep** - Mục sắp xếp (Ordering)
9. **TepTapTin** - Tệp tập tin (Media)

### Trò Chơi Trực Tiếp (8)
10. **PhienChoi** - Phiên chơi
11. **CaiDatPhienChoi** - Cài đặt phiên chơi
12. **CauHoiTrongPhien** - Câu hỏi trong phiên
13. **NguoiChoi** - Người chơi (Anonymous)
14. **TraLoiCauHoi** - Trả lời câu hỏi
15. **DiemSo** - Điểm số
16. **ThongKeQuestion** - Thống kê câu hỏi
17. **BangXepHang** - Bảng xếp hạng

### Chỉ Thị Thách Thức (4)
18. **ThachThuc** - Thách thức
19. **PhienThachThuc** - Phiên thách thức
20. **TraLoiThachThuc** - Trả lời thách thức
21. **BangXepHangThachThuc** - Bảng xếp hạng thách thức

### Quản Trị & Kiểm Toán (3)
22. **NhatKyKiemTra** - Nhật ký kiểm tra
23. **NhatKyQuanTri** - Nhật ký quản trị
24. **BoLocTuNgoNghat** - Bộ lọc từ ngôn ngữ

---

## 2. CHI TIẾT BẢNG (DATABASE SCHEMA - TIẾNG VIỆT)

### 1. NguoiDung
```sql
CREATE TABLE NguoiDung (
    idNguoiDung INT PRIMARY KEY IDENTITY(1,1),
    email NVARCHAR(255) NOT NULL UNIQUE,
    matKhau NVARCHAR(255) NOT NULL,
    tenDem NVARCHAR(100) NOT NULL,
    tenGoi NVARCHAR(100) NOT NULL,
    vaiTro VARCHAR(20) NOT NULL DEFAULT 'GIAOVIEN',
    urlAnhDaiDien NVARCHAR(500) NULL,
    gioiThieu NVARCHAR(MAX) NULL,
    thoiGianTao DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    thoiGianCapNhat DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    thoiGianXoa DATETIME2 NULL,
    CONSTRAINT ck_nguoiDung_vaiTro CHECK (vaiTro IN ('GIAOVIEN', 'QUANTRI'))
);
```

### 2. VaiTro
```sql
CREATE TABLE VaiTro (
    idVaiTro INT PRIMARY KEY IDENTITY(1,1),
    tenVaiTro VARCHAR(50) NOT NULL UNIQUE,
    moTa NVARCHAR(500) NULL,
    thoiGianTao DATETIME2 NOT NULL DEFAULT GETUTCDATE()
);
```

### 3. BoTrucNghiem
```sql
CREATE TABLE BoTrucNghiem (
    idBoTrucNghiem INT PRIMARY KEY IDENTITY(1,1),
    idNguoiDung INT NOT NULL,
    tenBoTrucNghiem NVARCHAR(255) NOT NULL,
    moTa NVARCHAR(MAX) NULL,
    urlAnhBia NVARCHAR(500) NULL,
    soCauHoi INT NOT NULL DEFAULT 0,
    thoiGianTao DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    thoiGianCapNhat DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    thoiGianXoa DATETIME2 NULL,
    FOREIGN KEY (idNguoiDung) REFERENCES NguoiDung(idNguoiDung),
    CONSTRAINT uk_boTrucNghiem_tenBoTrucNghiem_idNguoiDung 
        UNIQUE (tenBoTrucNghiem, idNguoiDung)
);
```

### 4. LoaiCauHoi
```sql
CREATE TABLE LoaiCauHoi (
    idLoaiCauHoi INT PRIMARY KEY IDENTITY(1,1),
    loaiCauHoi VARCHAR(50) NOT NULL UNIQUE,
    moTa NVARCHAR(500) NULL,
    soPhuongAnToiThieu INT NOT NULL DEFAULT 2,
    thoiGianTao DATETIME2 NOT NULL DEFAULT GETUTCDATE()
);
```

### 5. CauHoi
```sql
CREATE TABLE CauHoi (
    idCauHoi INT PRIMARY KEY IDENTITY(1,1),
    idBoTrucNghiem INT NOT NULL,
    loaiCauHoi VARCHAR(50) NOT NULL,
    noiDung NVARCHAR(MAX) NOT NULL,
    urlMedia NVARCHAR(500) NULL,
    thoiGianGioiHan_Giay INT NOT NULL DEFAULT 30,
    diem INT NOT NULL DEFAULT 10,
    viTri INT NOT NULL,
    soPhuongAn INT NOT NULL DEFAULT 0,
    thoiGianTao DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    thoiGianCapNhat DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    thoiGianXoa DATETIME2 NULL,
    FOREIGN KEY (idBoTrucNghiem) REFERENCES BoTrucNghiem(idBoTrucNghiem),
    FOREIGN KEY (loaiCauHoi) REFERENCES LoaiCauHoi(loaiCauHoi),
    CONSTRAINT ck_cauHoi_diem CHECK (diem >= 0 AND diem <= 1000),
    CONSTRAINT ck_cauHoi_thoiGianGioiHan CHECK (thoiGianGioiHan_Giay >= 1 AND thoiGianGioiHan_Giay <= 300)
);
```

### 6. PhuongAn
```sql
CREATE TABLE PhuongAn (
    idPhuongAn INT PRIMARY KEY IDENTITY(1,1),
    idCauHoi INT NOT NULL,
    noiDungPhuongAn NVARCHAR(MAX) NOT NULL,
    laKetQuaDung BIT NOT NULL DEFAULT 0,
    viTri INT NOT NULL,
    lanChon INT NOT NULL DEFAULT 0,
    urlAnhPhuongAn NVARCHAR(500) NULL,
    thoiGianTao DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    thoiGianCapNhat DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    FOREIGN KEY (idCauHoi) REFERENCES CauHoi(idCauHoi)
);
```

### 7. CapGhep
```sql
CREATE TABLE CapGhep (
    idCapGhep INT PRIMARY KEY IDENTITY(1,1),
    idCauHoi INT NOT NULL,
    benTrai NVARCHAR(MAX) NOT NULL,
    benPhai NVARCHAR(MAX) NOT NULL,
    viTri INT NOT NULL,
    thoiGianTao DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    thoiGianCapNhat DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    FOREIGN KEY (idCauHoi) REFERENCES CauHoi(idCauHoi)
);
```

### 8. MucSapXep
```sql
CREATE TABLE MucSapXep (
    idMucSapXep INT PRIMARY KEY IDENTITY(1,1),
    idCauHoi INT NOT NULL,
    noiDungMuc NVARCHAR(MAX) NOT NULL,
    viTriDung INT NOT NULL,
    viTriHienTai INT NOT NULL,
    thoiGianTao DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    thoiGianCapNhat DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    FOREIGN KEY (idCauHoi) REFERENCES CauHoi(idCauHoi)
);
```

### 9. TepTapTin
```sql
CREATE TABLE TepTapTin (
    idTepTapTin INT PRIMARY KEY IDENTITY(1,1),
    idNguoiDung INT NOT NULL,
    tenTep NVARCHAR(255) NOT NULL,
    duongDan NVARCHAR(500) NOT NULL,
    loaiTep VARCHAR(50) NOT NULL,
    kichThuoc BIGINT NOT NULL,
    thoiGianTai DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    FOREIGN KEY (idNguoiDung) REFERENCES NguoiDung(idNguoiDung)
);
```

### 10. PhienChoi
```sql
CREATE TABLE PhienChoi (
    idPhienChoi INT PRIMARY KEY IDENTITY(1,1),
    idBoTrucNghiem INT NOT NULL,
    idNguoiTochuc INT NOT NULL,
    maPIN CHAR(6) NOT NULL UNIQUE,
    trangThai VARCHAR(20) NOT NULL DEFAULT 'CHO',
    indexCauHoiHienTai INT NOT NULL DEFAULT 0,
    soNguoiChoi INT NOT NULL DEFAULT 0,
    soCauHoiBoQua INT NOT NULL DEFAULT 0,
    thoiGianBatDau DATETIME2 NULL,
    thoiGianKetThuc DATETIME2 NULL,
    thoiGianTao DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    thoiGianXoa DATETIME2 NULL,
    FOREIGN KEY (idBoTrucNghiem) REFERENCES BoTrucNghiem(idBoTrucNghiem),
    FOREIGN KEY (idNguoiTochuc) REFERENCES NguoiDung(idNguoiDung),
    CONSTRAINT ck_phienChoi_maPIN_length CHECK (LEN(maPIN) = 6),
    CONSTRAINT ck_phienChoi_trangThai CHECK (trangThai IN ('CHO', 'DANG_CHOI', 'KET_THUC'))
);
```

### 11. CaiDatPhienChoi
```sql
CREATE TABLE CaiDatPhienChoi (
    idCaiDat INT PRIMARY KEY IDENTITY(1,1),
    idPhienChoi INT NOT NULL UNIQUE,
    tatAmThanhVanNhan BIT NOT NULL DEFAULT 0,
    tatAmThanhPhienChoi BIT NOT NULL DEFAULT 0,
    hienThiBangXepHang BIT NOT NULL DEFAULT 1,
    thoiGianChoPhapTra INT NOT NULL DEFAULT 3000,
    cheDoBangXepHang VARCHAR(50) NOT NULL DEFAULT 'TUNG_TU_DO',
    FOREIGN KEY (idPhienChoi) REFERENCES PhienChoi(idPhienChoi)
);
```

### 12. CauHoiTrongPhien
```sql
CREATE TABLE CauHoiTrongPhien (
    idCauHoiTrongPhien INT PRIMARY KEY IDENTITY(1,1),
    idPhienChoi INT NOT NULL,
    idCauHoi INT NOT NULL,
    viTri INT NOT NULL,
    totalAnswers INT NOT NULL DEFAULT 0,
    correctAnswers INT NOT NULL DEFAULT 0,
    tyLeTraLoiDung DECIMAL(5, 2) NOT NULL DEFAULT 0,
    FOREIGN KEY (idPhienChoi) REFERENCES PhienChoi(idPhienChoi),
    FOREIGN KEY (idCauHoi) REFERENCES CauHoi(idCauHoi)
);
```

### 13. NguoiChoi
```sql
CREATE TABLE NguoiChoi (
    idNguoiChoi INT PRIMARY KEY IDENTITY(1,1),
    idPhienChoi INT NOT NULL,
    tenNguoiChoi NVARCHAR(100) NOT NULL,
    mauNenHoa VARCHAR(20) NOT NULL,
    daCauTraLoi BIT NOT NULL DEFAULT 0,
    hienCau BIT NOT NULL DEFAULT 0,
    trangThaiKetNoi VARCHAR(50) NOT NULL DEFAULT 'KET_NOI',
    thoiGianJoin DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    thoiGianRoiDi DATETIME2 NULL,
    thoiGianTao DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    FOREIGN KEY (idPhienChoi) REFERENCES PhienChoi(idPhienChoi)
);
```

### 14. TraLoiCauHoi
```sql
CREATE TABLE TraLoiCauHoi (
    idTraLoiCauHoi INT PRIMARY KEY IDENTITY(1,1),
    idNguoiChoi INT NOT NULL,
    idCauHoiTrongPhien INT NOT NULL,
    traLoi NVARCHAR(MAX) NOT NULL,
    dung BIT NOT NULL,
    diemNhan INT NOT NULL DEFAULT 0,
    thoiGianTraLoi_Ms INT NOT NULL,
    thoiGianTao DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    FOREIGN KEY (idNguoiChoi) REFERENCES NguoiChoi(idNguoiChoi),
    FOREIGN KEY (idCauHoiTrongPhien) REFERENCES CauHoiTrongPhien(idCauHoiTrongPhien)
);
```

### 15. DiemSo
```sql
CREATE TABLE DiemSo (
    idDiemSo INT PRIMARY KEY IDENTITY(1,1),
    idNguoiChoi INT NOT NULL UNIQUE,
    idPhienChoi INT NOT NULL,
    tongDiem INT NOT NULL DEFAULT 0,
    soCauTraLoiDung INT NOT NULL DEFAULT 0,
    soCauTraLoiSai INT NOT NULL DEFAULT 0,
    soCauBoQua INT NOT NULL DEFAULT 0,
    tyLeDung DECIMAL(5, 2) NOT NULL DEFAULT 0,
    xepHang INT NOT NULL,
    thoiGianTao DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    thoiGianCapNhat DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    FOREIGN KEY (idNguoiChoi) REFERENCES NguoiChoi(idNguoiChoi),
    FOREIGN KEY (idPhienChoi) REFERENCES PhienChoi(idPhienChoi)
);
```

### 16. ThongKeQuestion
```sql
CREATE TABLE ThongKeQuestion (
    idThongKe INT PRIMARY KEY IDENTITY(1,1),
    idCauHoiTrongPhien INT NOT NULL UNIQUE,
    soNguoiTraLoi INT NOT NULL DEFAULT 0,
    soTraLoiDung INT NOT NULL DEFAULT 0,
    tyLeTraLoiDung DECIMAL(5, 2) NOT NULL DEFAULT 0,
    thoiGianTraLoiTrungBinh INT NOT NULL DEFAULT 0,
    thoiGianTao DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    thoiGianCapNhat DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    FOREIGN KEY (idCauHoiTrongPhien) REFERENCES CauHoiTrongPhien(idCauHoiTrongPhien)
);
```

### 17. BangXepHang
```sql
CREATE TABLE BangXepHang (
    idBangXepHang INT PRIMARY KEY IDENTITY(1,1),
    idPhienChoi INT NOT NULL,
    xepHang INT NOT NULL,
    idNguoiChoi INT NOT NULL,
    tongDiem INT NOT NULL,
    tenNguoiChoi NVARCHAR(100) NOT NULL,
    thoiGianCapNhat DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    FOREIGN KEY (idPhienChoi) REFERENCES PhienChoi(idPhienChoi),
    FOREIGN KEY (idNguoiChoi) REFERENCES NguoiChoi(idNguoiChoi)
);
```

### 18. ThachThuc
```sql
CREATE TABLE ThachThuc (
    idThachThuc INT PRIMARY KEY IDENTITY(1,1),
    idBoTrucNghiem INT NOT NULL,
    idNguoiTao INT NOT NULL,
    tenThachThuc NVARCHAR(255) NOT NULL,
    moTa NVARCHAR(MAX) NULL,
    tokenLienKet VARCHAR(50) NOT NULL UNIQUE,
    trangThai VARCHAR(50) NOT NULL DEFAULT 'DANG_HOAT_DONG',
    thoiGianBatDau DATETIME2 NOT NULL,
    thoiGianKetThuc DATETIME2 NOT NULL,
    thoiGianTao DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    thoiGianCapNhat DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    thoiGianXoa DATETIME2 NULL,
    FOREIGN KEY (idBoTrucNghiem) REFERENCES BoTrucNghiem(idBoTrucNghiem),
    FOREIGN KEY (idNguoiTao) REFERENCES NguoiDung(idNguoiDung)
);
```

### 19. PhienThachThuc
```sql
CREATE TABLE PhienThachThuc (
    idPhienThachThuc INT PRIMARY KEY IDENTITY(1,1),
    idThachThuc INT NOT NULL,
    tenNguoiChoi NVARCHAR(100) NOT NULL,
    mauNenHoa VARCHAR(20) NOT NULL,
    tongDiem INT NOT NULL DEFAULT 0,
    soCauTraLoiDung INT NOT NULL DEFAULT 0,
    soCauTraLoiSai INT NOT NULL DEFAULT 0,
    soCauBoQua INT NOT NULL DEFAULT 0,
    hoanThanh BIT NOT NULL DEFAULT 0,
    thoiGianBatDau DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    thoiGianKetThuc DATETIME2 NULL,
    thoiGianTao DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    thoiGianCapNhat DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    FOREIGN KEY (idThachThuc) REFERENCES ThachThuc(idThachThuc)
);
```

### 20. TraLoiThachThuc
```sql
CREATE TABLE TraLoiThachThuc (
    idTraLoiThachThuc INT PRIMARY KEY IDENTITY(1,1),
    idPhienThachThuc INT NOT NULL,
    idCauHoi INT NOT NULL,
    traLoi NVARCHAR(MAX) NOT NULL,
    dung BIT NOT NULL,
    diemNhan INT NOT NULL DEFAULT 0,
    thoiGianTraLoi_Ms INT NOT NULL,
    thoiGianTao DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    thoiGianCapNhat DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    FOREIGN KEY (idPhienThachThuc) REFERENCES PhienThachThuc(idPhienThachThuc),
    FOREIGN KEY (idCauHoi) REFERENCES CauHoi(idCauHoi)
);
```

### 21. BangXepHangThachThuc
```sql
CREATE TABLE BangXepHangThachThuc (
    idBangXepHangThachThuc INT PRIMARY KEY IDENTITY(1,1),
    idThachThuc INT NOT NULL,
    xepHang INT NOT NULL,
    tenNguoiChoi NVARCHAR(100) NOT NULL,
    tongDiem INT NOT NULL,
    soLanHoanThanh INT NOT NULL DEFAULT 0,
    diemThapNhat INT NULL,
    diemCaoNhat INT NULL,
    diemTrungBinh DECIMAL(10, 2) NULL,
    thoiGianCapNhat DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    FOREIGN KEY (idThachThuc) REFERENCES ThachThuc(idThachThuc)
);
```

### 22. NhatKyKiemTra
```sql
CREATE TABLE NhatKyKiemTra (
    idNhatKyKiemTra INT PRIMARY KEY IDENTITY(1,1),
    idNguoiDung INT NOT NULL,
    thaoTac VARCHAR(50) NOT NULL,
    bangDuLieu VARCHAR(100) NOT NULL,
    idBanGhi INT NOT NULL,
    noiDungCu NVARCHAR(MAX) NULL,
    noiDungMoi NVARCHAR(MAX) NULL,
    diaChiIP VARCHAR(50) NOT NULL,
    thoiGianTao DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    FOREIGN KEY (idNguoiDung) REFERENCES NguoiDung(idNguoiDung)
);
```

### 23. NhatKyQuanTri
```sql
CREATE TABLE NhatKyQuanTri (
    idNhatKyQuanTri INT PRIMARY KEY IDENTITY(1,1),
    idQuanTri INT NOT NULL,
    thaoTac VARCHAR(100) NOT NULL,
    doiTuong VARCHAR(100) NOT NULL,
    idDoiTuong INT NOT NULL,
    chiTiet NVARCHAR(MAX) NULL,
    diaChiIP VARCHAR(50) NOT NULL,
    thoiGianTao DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    FOREIGN KEY (idQuanTri) REFERENCES NguoiDung(idNguoiDung)
);
```

### 24. BoLocTuNgoNghat
```sql
CREATE TABLE BoLocTuNgoNghat (
    idBoLoc INT PRIMARY KEY IDENTITY(1,1),
    tu NVARCHAR(255) NOT NULL UNIQUE,
    loaiTu VARCHAR(50) NOT NULL,
    mucDo VARCHAR(50) NOT NULL DEFAULT 'CANH_BAO',
    hoatDong BIT NOT NULL DEFAULT 1,
    thoiGianTao DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    thoiGianCapNhat DATETIME2 NOT NULL DEFAULT GETUTCDATE()
);
```

---

## 3. CHỈ MỤC (INDEXES)

```sql
-- Truy vấn PIN nhanh
CREATE UNIQUE INDEX idx_phienChoi_maPIN 
ON PhienChoi(maPIN);

-- Truy vấn người dùng theo email
CREATE UNIQUE INDEX idx_nguoiDung_email 
ON NguoiDung(email);

-- Truy vấn bộ trắc nghiệm theo người tạo
CREATE INDEX idx_boTrucNghiem_idNguoiDung 
ON BoTrucNghiem(idNguoiDung)
WHERE thoiGianXoa IS NULL;

-- Truy vấn câu hỏi theo bộ
CREATE INDEX idx_cauHoi_idBoTrucNghiem 
ON CauHoi(idBoTrucNghiem)
WHERE thoiGianXoa IS NULL;

-- Truy vấn phiên chơi theo trạng thái
CREATE INDEX idx_phienChoi_trangThai 
ON PhienChoi(trangThai)
WHERE thoiGianXoa IS NULL;

-- Truy vấn trả lời theo người chơi
CREATE INDEX idx_traLoiCauHoi_idNguoiChoi 
ON TraLoiCauHoi(idNguoiChoi);

-- Truy vấn bảng xếp hạng theo phiên
CREATE INDEX idx_bangXepHang_idPhienChoi 
ON BangXepHang(idPhienChoi);

-- Truy vấn token thách thức
CREATE UNIQUE INDEX idx_thachThuc_tokenLienKet 
ON ThachThuc(tokenLienKet);

-- Composite: Người dùng + thời gian
CREATE INDEX idx_nhatKyKiemTra_nguoiDung_thoiGian 
ON NhatKyKiemTra(idNguoiDung, thoiGianTao DESC);

-- Soft delete filtered indexes
CREATE INDEX idx_boTrucNghiem_active 
ON BoTrucNghiem(idNguoiDung) 
WHERE thoiGianXoa IS NULL;

CREATE INDEX idx_cauHoi_active 
ON CauHoi(idBoTrucNghiem) 
WHERE thoiGianXoa IS NULL;
```

---

**Hoàn Thành:** ERD 100% Tiếng Việt Không Dấu ✅
